import type { LenisOptions } from "lenis";

/** Wheel interpolation only; anchors and touch remain browser/Next.js owned. */
export const smoothScrollOptions = {
  lerp: 0.18,
  wheelMultiplier: 1,
  smoothWheel: true,
  syncTouch: false,
  autoRaf: false,
  anchors: false,
  stopInertiaOnNavigate: true,
  // The shared motion.allowed gate owns preference changes and destroys Lenis.
  respectReducedMotion: false,
  allowNestedScroll: true,
  prevent: (node) =>
    node.matches('input, textarea, select, [contenteditable="true"], dialog, [role="dialog"]'),
} satisfies LenisOptions;
