// Distances are viewport-height multiples, not wheel events.
export const motion = {
  ease: "power3.out",
  reveal: 0.85,
  stagger: 0.12,
  scrub: 0.65,
  intensity: { desktop: 1, tablet: 0.75, mobile: 0.3 },
  overlap: 0.18,
  desktop: "(min-width: 1100px) and (min-height: 720px)",
  tablet: "(min-width: 700px) and (max-width: 1099px) and (min-height: 720px)",
  allowed: "(prefers-reduced-motion: no-preference)",
  systemDistance: { desktop: 3.6, tablet: 2.5 },
  workflowDistance: { desktop: 4.2 },
} as const;
export type MotionConditions = { desktop: boolean; tablet: boolean; allowed: boolean };
