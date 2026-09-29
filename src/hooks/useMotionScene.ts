"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, type MotionConditions } from "@/lib/motion";
type Setup = (root: HTMLElement, conditions: MotionConditions) => void | (() => void);

/** Define setup at module scope so rerenders do not reinitialize the scene. */
export function useMotionScene<T extends HTMLElement>(setup: Setup) {
  const root = useRef<T>(null);
  useLayoutEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    const media = gsap.matchMedia();
    let disposed = false;
    let frame = 0;
    const refresh = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    };
    media.add(
      { desktop: motion.desktop, tablet: motion.tablet, allowed: motion.allowed },
      (context) => {
        const conditions = context.conditions as MotionConditions;
        if (!conditions.allowed) return;
        const cleanup = setup(element, conditions);
        refresh();
        return cleanup;
      },
      element,
    );
    void document.fonts.ready.then(refresh);
    const disclosureEnd = (event: TransitionEvent) => {
      if (
        event.propertyName === "height" &&
        event.target instanceof Element &&
        event.target.closest("details")
      )
        refresh();
    };
    element.addEventListener("load", refresh, true);
    element.addEventListener("toggle", refresh, true);
    element.addEventListener("transitionend", disclosureEnd, true);
    window.addEventListener("pageshow", refresh);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      element.removeEventListener("load", refresh, true);
      element.removeEventListener("toggle", refresh, true);
      element.removeEventListener("transitionend", disclosureEnd, true);
      window.removeEventListener("pageshow", refresh);
      media.revert();
    };
  }, [setup]);
  return root;
}
