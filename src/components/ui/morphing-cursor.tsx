"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "@/styles/morphing-cursor.css";

/** Adapted from the supplied MagneticText: lerped circle + inverse text translation. */
export function MagneticText({
  children,
  hoverLines,
}: {
  children: ReactNode;
  hoverLines: readonly string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const innerTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const circle = circleRef.current!;
    const inner = innerTextRef.current!;
    const heading = container.querySelector<HTMLElement>("[data-magnetic-heading]")!;
    const media = matchMedia(
      "(min-width: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let hovered = false;
    let disposed = false;
    let diameter = 0;
    let mouse = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let size = 220;
    const measure = () => {
      size =
        window.innerWidth >= 1440
          ? Math.min(300, Math.max(270, window.innerWidth * 0.1875))
          : Math.min(260, Math.max(220, window.innerWidth * 0.18));
      container.style.overflowClipMargin = `${size / 2}px`;
      const style = getComputedStyle(heading);
      Object.assign(inner.style, {
        width: `${heading.offsetWidth}px`,
        height: `${heading.offsetHeight}px`,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing,
        lineHeight: style.lineHeight,
        textAlign: style.textAlign,
        textTransform: style.textTransform,
      });
      circle.style.left = `${heading.offsetLeft}px`;
      circle.style.top = `${heading.offsetTop}px`;
    };
    const paint = () => {
      frame = 0;
      if (disposed) return;
      current.x += (mouse.x - current.x) * 0.15;
      current.y += (mouse.y - current.y) * 0.15;
      diameter += ((hovered ? size : 0) - diameter) * 0.22;
      if (Math.abs((hovered ? size : 0) - diameter) < 0.05) diameter = hovered ? size : 0;
      circle.style.transform = `translate(${current.x}px, ${current.y}px) translate(-50%, -50%)`;
      inner.style.transform = `translate(${-current.x}px, ${-current.y}px)`;
      circle.style.width = `${diameter}px`;
      circle.style.height = `${diameter}px`;
      if (hovered || diameter > 0) frame = requestAnimationFrame(paint);
      else container.removeAttribute("data-magnetic-active");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const close = () => {
      hovered = false;
      // Restore the native cursor immediately; keep only the closing circle alive.
      heading.removeAttribute("data-magnetic-hover");
      if (diameter > 0) schedule();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !media.matches || heading.dataset.heroReady !== "true")
        return;
      if (!hovered) measure();
      const rect = heading.getBoundingClientRect();
      // Preserve the full lens at viewport edges without moving its aligned text.
      const centerX = Math.min(window.innerWidth - size / 2, Math.max(size / 2, event.clientX));
      mouse = { x: centerX - rect.left, y: event.clientY - rect.top };
      if (!hovered) {
        current = { ...mouse };
        hovered = true;
        container.dataset.magneticActive = "true";
        heading.dataset.magneticHover = "true";
      }
      schedule();
    };
    const reset = () => {
      close();
      if (!media.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        diameter = 0;
        circle.style.width = "0px";
        circle.style.height = "0px";
        container.removeAttribute("data-magnetic-active");
      }
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
      heading.removeAttribute("data-magnetic-hover");
      container.removeAttribute("data-magnetic-active");
    };
  }, []);

  return (
    <div ref={containerRef} className="magnetic-text">
      {children}
      <div ref={circleRef} className="magnetic-text-circle" aria-hidden="true">
        <div ref={innerTextRef} className="magnetic-text-alternate">
          {hoverLines.map((line) => (
            <span className="line-mask" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
