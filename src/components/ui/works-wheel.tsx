"use client";

// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
import * as React from "react";

import Image from "next/image";
import Link from "next/link";
import { motion } from "@/lib/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  wheelActive,
  wheelProgress,
  wheelRingLabelOpacity,
  wheelScrollUnits,
  wheelTurn,
} from "@/lib/worksWheel";

const interactiveQuery = `(min-width: 1024px) and (min-height: 760px) and ${motion.allowed}`;
function subscribeInteraction(change: () => void) {
  const query = window.matchMedia(interactiveQuery);
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
}
const isInteractive = () => window.matchMedia(interactiveQuery).matches;
const serverInteractive = () => false;

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image?: string;
  alt?: string;
  /** Existing project preview when no approved cover asset is available. */
  preview?: React.ReactNode;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Editorial content shares the existing scene pin, including in static fallback. */
  header?: React.ReactNode;
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.4; // slightly larger artwork relative to the open stage
const CARD_MAX_W = 0.62; // permit readable preview widths on smaller desktop stages
const FRONT_SCALE = 1.22; // readable preview size within the supplied face-scale reveal
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side

/** How much of a dragged pixel counts as one item. */
const DRAG_UNITS = 420;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number; headerH: number; headerClipH: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) => -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  header,
  label = "Works '26",
  action = "View",
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<ScrollTrigger | null>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const instanceId = React.useId();
  const interactive = React.useSyncExternalStore(
    subscribeInteraction,
    isInteractive,
    serverInteractive,
  );

  // The wheel's position, and where it is heading. Only `active` is state -
  // everything else is written to the DOM, so turning the wheel is not a render.
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const activeRef = React.useRef(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0, headerH: 0, headerClipH: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  // Read after mount, not during render: the server has no matchMedia, and
  // branching on it inline is a hydration mismatch.
  // Shared preference gate uses the complete static browser instead of 3D easing.

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () =>
      setStage({
        w: el.clientWidth,
        h: el.clientHeight,
        headerH: headerRef.current?.clientHeight || 0,
        // Preserve the existing integer geometry, but mask at the actual subpixel edge.
        headerClipH: headerRef.current?.getBoundingClientRect().height || 0,
      });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, [interactive]);

  const metrics = React.useMemo(() => {
    // Retain the approved artwork measurements, without a smaller viewport/context.
    const w = stage.w * 0.7;
    const h = Math.max(0, stage.h - stage.headerH - 40);
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    // Shrink the ring's cards until the circle reads as a closed loop rather
    // than beads on a wire, however many pieces the wheel is given.
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
  }, [stage, count]);

  // One pass per frame: ease toward the target, then write every transform.
  React.useEffect(() => {
    if (!stage.h || !interactive) return;
    let frame = 0;
    let labelOpacity = -1;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * EASE;

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      // The drum is pulled back so its front face lands on the picture plane.
      // That set-back has to arrive with the drum, or the ring would sit at the
      // far side of the perspective and render at half its size.
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(d * (360 / count), drumDeg, ringR, drumR, bow, m);
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) {
          face.style.transform = `scale(${lerp(ringScale, FRONT_SCALE, m)})`;
        }
      }

      const nextLabelOpacity = wheelRingLabelOpacity(m);
      if (labelRef.current && nextLabelOpacity !== labelOpacity) {
        labelRef.current.style.opacity = String(nextLabelOpacity);
        labelOpacity = nextLabelOpacity;
      }
      const near = wheelActive(pos, activeRef.current, last);
      if (near !== activeRef.current) {
        activeRef.current = near;
        setActive(near);
      }
    };

    draw();
    cancelAnimationFrame(frame);
    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frame);
        if (entry.isIntersecting) frame = requestAnimationFrame(draw);
      },
      { rootMargin: "100px" },
    );
    if (stageRef.current) observer.observe(stageRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [metrics, stage.h, count, last, interactive]);

  const to = React.useCallback(
    (next: number) => {
      const scene = sceneRef.current;
      if (!scene) return;
      window.scrollTo({
        top: scene.start + wheelProgress(next, count) * (scene.end - scene.start),
        behavior: "instant",
      });
      // Reuse the existing native-position synchronization hook of the sole Lenis owner.
      window.dispatchEvent(new Event("portfolio:scroll-restored"));
      ScrollTrigger.update();
    },
    [count],
  );

  // Page scroll owns progress and pinning; the supplied rAF owns only card transforms.
  // There is no wheel interception, scroll lock or second smooth-scroll instance.
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el || !interactive || !count) return;
    gsap.registerPlugin(ScrollTrigger);
    const scene = ScrollTrigger.create({
      id: "selected-work-wheel",
      trigger: el,
      pin: el,
      // Existing upstream System Overview is priority 2; downstream Workflow is 1.
      refreshPriority: 1.5,
      start: () => `top ${Math.max(72, (window.innerHeight - el.clientHeight) / 2)}px`,
      end: () =>
        `+=${((count * wheelScrollUnits(count)) / (count + 0.35)) * Math.max(500, window.innerHeight * 0.75)}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        target.current = wheelTurn(self.progress, count);
      },
      onRefresh: (self) => {
        target.current = wheelTurn(self.progress, count);
      },
    });
    sceneRef.current = scene;
    const refresh = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(refresh);
      scene.kill(true);
      sceneRef.current = null;
    };
  }, [count, interactive]);

  const drag = React.useRef<{ y: number; start: number; turn: number; moved: boolean } | null>(
    null,
  );
  const dragged = React.useRef(false);
  const instructionId = `${instanceId}-instructions`;

  const cover = (item: WorksWheelItem, width?: number) =>
    item.image ? (
      <Image
        src={item.image}
        alt={item.alt || `${item.title} preview`}
        fill
        sizes="(max-width: 767px) 85vw, 34vw"
        draggable={false}
      />
    ) : (
      <span className="works-wheel-preview" aria-hidden="true">
        <span
          className="works-wheel-art"
          style={
            width
              ? {
                  width: 480,
                  height: 480 / CARD_RATIO,
                  transform: `scale(${width / 480})`,
                  transformOrigin: "top left",
                }
              : undefined
          }
        >
          {item.preview}
        </span>
      </span>
    );

  if (!count) return null;
  if (!interactive)
    return (
      <section
        className={`works-wheel works-wheel--static ${className || ""}`}
        aria-label={label}
        {...props}
      >
        {header && <div className="works-wheel-header">{header}</div>}
        <ol className="works-wheel-browser">
          {items.map((item) => (
            <li key={item.href || item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="works-wheel-static-card"
                  aria-label={`View case study: ${item.title}`}
                >
                  <span className="works-wheel-static-cover">{cover(item)}</span>
                  <h3>{item.title}</h3>
                  <span className="text-link">
                    <span className="cta-label">{action}</span>
                  </span>
                </Link>
              ) : (
                <>
                  <span className="works-wheel-static-cover">{cover(item)}</span>
                  <h3>{item.title}</h3>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>
    );

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className={`works-wheel ${className || ""}`}
      {...props}
    >
      {header && (
        <div ref={headerRef} className="works-wheel-header">
          {header}
        </div>
      )}
      <p
        id={instructionId}
        className="works-wheel-instructions micro"
        style={{ top: stage.headerH + 4 }}
      >
        SCROLL TO EXPLORE / DRAG / ↑ ↓
      </p>
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label={`${label} project wheel`}
        aria-describedby={instructionId}
        className="works-wheel-stage"
        onDragStart={(event) => event.preventDefault()}
        style={{
          perspective: `${metrics.depth}px`,
          perspectiveOrigin: `45% ${stage.headerH + 24 + Math.max(0, stage.h - stage.headerH - 40) / 2}px`,
          // Reserve the existing header area explicitly: an opaque sibling background
          // intermittently over-occludes moving 3D card surfaces in Chrome.
          clipPath: `inset(${stage.headerClipH}px 0 0 0)`,
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          // Native focus scrolling uses the unprojected 3D link box and can leave the pin.
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
          dragged.current = false;
          drag.current = {
            y: event.clientY,
            start: event.clientY,
            turn: target.current,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          const current = drag.current;
          if (!current) return;
          if (!current.moved && Math.abs(current.start - event.clientY) < 6) return;
          current.moved = true;
          dragged.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          to(current.turn + (current.start - event.clientY) / DRAG_UNITS);
          current.y = event.clientY;
        }}
        onPointerUp={() => {
          const current = drag.current;
          drag.current = null;
          const next = current?.moved
            ? current.turn + (current.start - current.y) / DRAG_UNITS
            : target.current;
          if (next > 1) to(Math.round(next));
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
        onClickCapture={(event) => {
          if (dragged.current) {
            event.preventDefault();
            event.stopPropagation();
            dragged.current = false;
          }
        }}
        onKeyDown={(event) => {
          if (event.ctrlKey || event.metaKey || event.altKey) return;
          if (event.key === "ArrowDown" && target.current >= count) return;
          if (event.key === "ArrowUp" && target.current <= 0) return;
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="works-wheel-drum"
          style={{ top: stage.headerH + 24 + Math.max(0, stage.h - stage.headerH - 40) / 2 }}
        >
          {items.map((item, i) => {
            const cardProps = {
              id: `${instanceId}-card-${i}`,
              className: "works-wheel-card",
              tabIndex: i === active ? 0 : -1,
              style: {
                width: metrics.cardW,
                height: metrics.cardH,
                marginLeft: -metrics.cardW / 2,
                marginTop: -metrics.cardH / 2,
              },
              ref: (node: HTMLElement | null) => {
                cardRefs.current[i] = node;
              },
            };
            const face = (
              <span className="works-wheel-face">
                {cover(item, metrics.cardW)}
                {action && item.href && <span className="works-wheel-action micro">{action}</span>}
              </span>
            );
            return item.href ? (
              <Link
                key={item.href}
                {...cardProps}
                href={item.href}
                draggable={false}
                aria-label={`View case study: ${item.title}`}
              >
                {face}
              </Link>
            ) : (
              <div key={item.title} {...cardProps}>
                {face}
              </div>
            );
          })}
        </div>
      </div>
      <div
        ref={labelRef}
        className="works-wheel-ring-label"
        style={{ fontSize: Math.max(22, metrics.title), top: stage.headerH }}
      >
        {label}
      </div>
      <div
        className="works-wheel-title"
        style={{ top: stage.headerH + (stage.h - stage.headerH) / 2 }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="micro">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <h3>{items[active]?.title}</h3>
      </div>
      <ol
        className="works-wheel-index"
        style={{ top: stage.headerH + (stage.h - stage.headerH) * 0.11 }}
        aria-label="Choose a featured project"
      >
        {items.map((item, i) => (
          <li key={item.href || item.title}>
            <button type="button" onClick={() => to(i + 1)} aria-pressed={i === active}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {item.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WorksWheel;
