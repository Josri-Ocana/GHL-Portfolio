"use client";

/**
 * Glyph Portal © 2026 Christian Katzmann. MIT.
 * Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
 * A scroll-driven camera through live type. Keep this notice with copies.
 * Portfolio adaptation: ScrollTrigger owns progress; native document owns content.
 */
import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp, interior, smooth, type Ink } from "@/lib/glyphPortal";
import "@/styles/glyph-portal.css";

const WORD = "BUILD.";
const DISTANCE = 1.8;

export default function GlyphPortal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const clipId = `gp-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current!;
    const stage = section.querySelector<HTMLElement>("[data-gp-stage]")!;
    const field = section.querySelector<HTMLElement>("[data-gp-field]")!;
    const art = section.querySelector<SVGSVGElement>("svg")!;
    const clip = section.querySelector<SVGClipPathElement>("clipPath")!;
    const glyph = section.querySelector<SVGTextElement>("text")!;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const media = gsap.matchMedia();
    let disposed = false;
    let refreshFrame = 0;

    // Wait for the existing, locally served display face. No new font request.
    void document.fonts.ready.then(() => {
      if (disposed || !context) return;
      media.add(
        "(min-width: 700px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)",
        () => {
          let W = 1,
            H = 1,
            startScale = 1,
            endScale = 1;
          let center = { x: 0, y: 0 };
          let target: Ink | null = null;
          let measuredGeometry = "";
          const measure = () => {
            W = stage.clientWidth;
            H = stage.clientHeight;
            const font = getComputedStyle(glyph);
            const geometryKey = `${W}:${H}:${font.fontWeight}:${font.fontFamily}`;
            if (geometryKey === measuredGeometry) return;
            const baseFont = `${font.fontWeight} 100px ${font.fontFamily}`;
            context.font = baseFont;
            context.fontKerning = "none";
            const metrics = context.measureText(WORD);
            const bounds = {
              x: -metrics.actualBoundingBoxLeft,
              y: -metrics.actualBoundingBoxAscent,
              width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
              height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
            };
            if (!bounds.width || !bounds.height) return;
            measuredGeometry = geometryKey;
            center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
            const advances = Array.from(
              { length: WORD.length },
              (_, i) => context.measureText(WORD.slice(0, i)).width,
            );
            const candidates: Ink[] = [];
            Array.from(WORD).forEach((char, index) => {
              const found = interior(context, char, `${font.fontWeight} 300px ${font.fontFamily}`);
              if (found) candidates.push({ ...found, x: found.x + advances[index], index });
            });
            target =
              candidates.find((item) => item.index === WORD.indexOf("B")) ??
              candidates.sort(
                (a, b) =>
                  b.radius - a.radius || Math.abs(a.x - center.x) - Math.abs(b.x - center.x),
              )[0] ??
              null;
            startScale = Math.min((W * 0.84) / bounds.width, (H * 0.38) / bounds.height);
            endScale = target
              ? Math.max(startScale, Math.hypot(W, H) / (target.radius * 1.35))
              : startScale;
            art.setAttribute("viewBox", `0 0 ${W} ${H}`);
            section.dataset.gpFocus = target ? WORD[target.index] : "";
          };
          const paint = (progress: number) => {
            const p = target ? progress : 0;
            const t = clamp(p / 0.78);
            const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
            const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
            const blend =
              endScale === startScale
                ? 0
                : (1 / scale - 1 / startScale) / (1 / endScale - 1 / startScale);
            const cx = center.x + ((target?.x ?? center.x) - center.x) * blend;
            const cy = center.y + ((target?.y ?? center.y) - center.y) * blend;
            const roll = -4 * smooth(0.06, 0.5, t) * (1 - smooth(0.62, 0.92, t));
            const radians = (roll * Math.PI) / 180;
            const dx = W / 2 / scale,
              dy = (H * 0.46 + H * 0.04 * eased) / scale;
            clip.setAttribute("transform", `scale(${scale}) rotate(${roll})`);
            glyph.setAttribute(
              "transform",
              `translate(${Math.cos(radians) * dx + Math.sin(radians) * dy - cx} ${-Math.sin(radians) * dx + Math.cos(radians) * dy - cy})`,
            );
            field.style.clipPath = t >= 1 ? "none" : `url(#${clipId})`;
            stage.style.opacity = String(1 - smooth(0.78, 0.9, p));
            section.dataset.gpProgress = p.toFixed(5);
          };
          section.dataset.gpMotion = "on";
          measure();
          if (!target) {
            delete section.dataset.gpMotion;
            return;
          }
          paint(0);
          const trigger = ScrollTrigger.create({
            id: "hero-services-glyph-portal",
            trigger: stage,
            pin: stage,
            start: "top top",
            end: () => `+=${stage.clientHeight * DISTANCE}`,
            refreshPriority: 3,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onRefresh: (self) => paint(self.progress),
            onUpdate: (self) => paint(self.progress),
          });
          // The real section remains a sibling of the pin, never nested in it.
          // Resize/font geometry is read only during ScrollTrigger refresh.
          cancelAnimationFrame(refreshFrame);
          refreshFrame = requestAnimationFrame(() => {
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
          });
          return () => {
            trigger.kill(true);
            delete section.dataset.gpMotion;
            delete section.dataset.gpProgress;
            stage.style.removeProperty("opacity");
            field.style.removeProperty("clip-path");
          };
        },
      );
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(refreshFrame);
      media.revert();
    };
  }, [clipId]);

  return (
    <div ref={root} className="glyph-portal">
      <div className="glyph-portal-stage" data-gp-stage aria-hidden="true">
        <span className="glyph-portal-poster">{WORD}</span>
        <div className="glyph-portal-field" data-gp-field />
        <svg aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <text
                x="0"
                y="0"
                style={{
                  fontFamily: "var(--font-display), Impact, sans-serif",
                  fontWeight: 700,
                  fontSize: 100,
                  fontKerning: "none",
                  fontVariantLigatures: "none",
                  letterSpacing: 0,
                }}
              >
                {WORD}
              </text>
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="glyph-portal-content">{children}</div>
    </div>
  );
}
