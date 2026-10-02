"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion } from "@/lib/motion";
import { smoothScrollOptions } from "@/lib/smoothScroll";

/** Uses native window scrolling, so existing sticky/pinned scenes keep their geometry. */
export function SmoothScroll() {
  const instance = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
    const media = gsap.matchMedia();
    media.add(
      { allowed: motion.allowed, wheel: "(hover: hover) and (pointer: fine)" },
      (context) => {
        if (!context.conditions?.allowed || !context.conditions?.wheel) return;
        const lenis = new Lenis(smoothScrollOptions);
        instance.current = lenis;
        const tick = (seconds: number) => lenis.raf(seconds * 1000);
        const reset = () => lenis.scrollTo(lenis.actualScroll, { immediate: true });
        // Cancel wheel momentum before native keyboard/focus/history/anchor scrolls.
        // No default prevention: the browser and Next retain navigation ownership.
        const keydown = (event: KeyboardEvent) => {
          if (
            ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(
              event.key,
            )
          )
            reset();
        };
        const click = (event: MouseEvent) => {
          if (event.target instanceof Element && event.target.closest("a[href]")) reset();
        };
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        window.addEventListener("keydown", keydown, true);
        window.addEventListener("click", click, true);
        window.addEventListener("focusin", reset);
        window.addEventListener("popstate", reset);
        window.addEventListener("pageshow", reset);
        return () => {
          gsap.ticker.remove(tick);
          lenis.off("scroll", ScrollTrigger.update);
          window.removeEventListener("keydown", keydown, true);
          window.removeEventListener("click", click, true);
          window.removeEventListener("focusin", reset);
          window.removeEventListener("popstate", reset);
          window.removeEventListener("pageshow", reset);
          lenis.destroy();
          instance.current = null;
        };
      },
    );
    return () => media.revert();
  }, []);

  useEffect(() => {
    // Sync to Next's chosen position; never force top or replace history restoration.
    instance.current?.resize();
  }, [pathname]);

  return null;
}
