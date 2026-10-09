"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "@/styles/hero-text-reveal.css";

/**
 * Pointer-percentage / inset reveal concept: Text Reveal Card by Manu Arora,
 * https://21st.dev/@manuarora700/components/text-reveal-card (demo 1475).
 * Adapted to the semantic hero; no demo stars or additional motion runtime.
 */
export function HeroTextReveal({
  children,
  lines,
}: {
  children: ReactNode;
  lines: readonly string[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const field = fieldRef.current!;
    const text = textRef.current!;
    const heading = root.querySelector<HTMLElement>("[data-magnetic-heading]")!;
    const media = matchMedia(
      "(min-width: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0,
      lastTime = 0,
      target = 0,
      progress = 0,
      active = false,
      disposed = false;

    const measure = () => {
      const style = getComputedStyle(heading);
      Object.assign(field.style, {
        left: `${heading.offsetLeft}px`,
        top: `${heading.offsetTop}px`,
        width: `${heading.offsetWidth}px`,
        height: `${heading.offsetHeight}px`,
      });
      Object.assign(text.style, {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing,
        lineHeight: style.lineHeight,
        textAlign: style.textAlign,
        textTransform: style.textTransform,
      });
    };
    const paint = (now: number) => {
      frame = 0;
      if (disposed) return;
      const elapsed = lastTime ? Math.min(64, now - lastTime) : 1000 / 60;
      lastTime = now;
      const blend = 1 - Math.pow(active ? 0.86 : 0.78, elapsed / (1000 / 60));
      progress += (target - progress) * blend;
      if (Math.abs(target - progress) < 0.0005) progress = target;
      field.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
      root.dataset.revealProgress = progress.toFixed(4);
      if (Math.abs(target - progress) > 0) frame = requestAnimationFrame(paint);
      if (!active && progress === 0) root.removeAttribute("data-reveal-active");
    };
    const schedule = () => {
      if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(paint);
      }
    };
    const close = () => {
      active = false;
      target = 0;
      heading.removeAttribute("data-reveal-hover");
      schedule();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !media.matches || heading.dataset.heroReady !== "true")
        return;
      if (!active) measure();
      const rect = heading.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      // The final 4% is a full-message reading zone rather than a sliver of text.
      target = ratio >= 0.96 ? 1 : Math.max(0, Math.min(1, ratio));
      active = true;
      root.dataset.revealActive = "true";
      heading.dataset.revealHover = "true";
      schedule();
    };
    const reset = () => {
      close();
      cancelAnimationFrame(frame);
      frame = 0;
      progress = 0;
      field.style.clipPath = "inset(0 100% 0 0)";
      root.removeAttribute("data-reveal-active");
      root.dataset.revealProgress = "0";
      measure();
    };
    const visibility = () => {
      if (document.hidden) close();
    };
    const observer = new ResizeObserver(reset);
    observer.observe(heading);
    heading.addEventListener("pointerenter", move);
    heading.addEventListener("pointermove", move);
    heading.addEventListener("pointerleave", close);
    heading.addEventListener("pointercancel", close);
    media.addEventListener("change", reset);
    window.addEventListener("blur", close);
    window.addEventListener("scroll", close, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      heading.removeEventListener("pointerenter", move);
      heading.removeEventListener("pointermove", move);
      heading.removeEventListener("pointerleave", close);
      heading.removeEventListener("pointercancel", close);
      media.removeEventListener("change", reset);
      window.removeEventListener("blur", close);
      window.removeEventListener("scroll", close);
      document.removeEventListener("visibilitychange", visibility);
      heading.removeAttribute("data-reveal-hover");
    };
  }, []);

  return (
    <div ref={rootRef} className="hero-text-reveal">
      {children}
      <div ref={fieldRef} className="hero-reveal-field" aria-hidden="true">
        <div ref={textRef} className="hero-reveal-copy">
          {lines.map((line) => (
            <span className="line-mask" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
