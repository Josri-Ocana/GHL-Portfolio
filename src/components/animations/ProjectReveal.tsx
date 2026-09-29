"use client";
import gsap from "gsap";
import { useMotionScene } from "@/hooks/useMotionScene";
import { motion, type MotionConditions } from "@/lib/motion";
function projectTimeline(root: HTMLElement, { desktop, tablet }: MotionConditions) {
  const wide = (desktop || tablet) && root.dataset.subtle !== "true";
  const timeline = gsap.timeline({
    defaults: { ease: motion.ease, clearProps: "all" },
    scrollTrigger: { trigger: root, start: "top 91%", toggleActions: "play none none none" },
  });
  timeline
    .from(root.querySelector(".project-cover"), {
      clipPath: wide ? "inset(18% 10% 14% 10%)" : "inset(8% 3% 8% 3%)",
      scaleX: wide ? 0.88 : 0.96,
      y: wide ? 45 : 20,
      duration: 1,
    })
    .from(
      root.querySelectorAll(".project-meta, .project-card > p"),
      { y: 25, clipPath: "inset(0 0 100% 0)", stagger: 0.09, duration: 0.6 },
      0.25,
    )
    .from(
      root.querySelector(".project-title"),
      { x: wide ? -30 : -12, clipPath: "inset(0 100% 0 0)", duration: 0.8 },
      0.3,
    )
    .from(root.querySelector(".project-cover-label"), { y: 25, opacity: 0, duration: 0.6 }, 0.45);
  // A keyboard user must never focus content that is still clipped by its reveal.
  const show = () => {
    timeline.progress(1);
  };
  root.addEventListener("focusin", show);
  return () => root.removeEventListener("focusin", show);
}
export function ProjectReveal({
  children,
  subtle = false,
}: {
  children: React.ReactNode;
  subtle?: boolean;
}) {
  const root = useMotionScene<HTMLDivElement>(projectTimeline);
  return (
    <div ref={root} className="project-reveal" data-subtle={subtle}>
      {children}
    </div>
  );
}
