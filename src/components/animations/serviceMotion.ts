import gsap from "gsap";
import { motion } from "@/lib/motion";

/** Reversible service demonstrations, owned by PageMotion's existing GSAP context. */
export function serviceMotion(row: HTMLElement, compact: boolean) {
  const visual = row.querySelector<HTMLElement>("[data-service-visual]");
  if (!visual) return;
  const nodes = visual.querySelectorAll<SVGGElement>("[data-service-node]");
  const lines = visual.querySelectorAll<SVGPathElement>("[data-service-line]");
  const timeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      id: `service-${visual.dataset.serviceVisual}`,
      trigger: row,
      start: "top 82%",
      end: "top 8%",
      scrub: motion.scrub,
      invalidateOnRefresh: true,
    },
  });

  // Copy remains opaque. The panel settles before its diagram finishes building.
  timeline
    .fromTo(row, { y: compact ? 32 : 72 }, { y: 0, duration: 0.8, ease: "power3.out" }, 0)
    .fromTo(row, { "--divider-scale": 0 }, { "--divider-scale": 1, duration: 1 }, 0);

  switch (visual.dataset.serviceVisual) {
    case "pipeline": {
      timeline
        .fromTo(
          nodes,
          { y: 55, opacity: 0.2 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.13 },
          0,
        )
        .fromTo(
          lines,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.2, stagger: 0.08 },
          0.55,
        );
      const ticket = visual.querySelector("[data-service-transfer]");
      timeline
        .fromTo(ticket, { x: -332 }, { x: -166, duration: 0.85 }, 0.55)
        .to(ticket, { x: 0, duration: 0.85 }, 1.65);
      break;
    }
    case "workflow":
      timeline
        .fromTo(nodes[0], { y: -45, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0)
        .fromTo(
          nodes[1],
          { scale: 0.3, opacity: 0, svgOrigin: "280 130" },
          { scale: 1, opacity: 1, duration: 0.9 },
          0.6,
        )
        .fromTo(
          lines,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.7, ease: "none" },
          0.45,
        )
        .fromTo(
          nodes[2],
          { x: 110, y: -40, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 1.1 },
          1.3,
        )
        .fromTo(
          nodes[3],
          { x: -110, y: -40, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 1.1 },
          1.5,
        );
      break;
    case "website":
      timeline
        .fromTo(
          nodes[0],
          { x: -65, y: 40, opacity: 0.15 },
          { x: 0, y: 0, opacity: 1, duration: 1.35 },
          0.1,
        )
        .fromTo(
          nodes[1],
          { x: 85, y: 75, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 1.4 },
          1.05,
        )
        .fromTo(
          visual.querySelectorAll(".service-ticket--active"),
          { fill: "#151515" },
          { fill: "#261a14", duration: 0.6 },
          2,
        );
      break;
    case "integration": {
      const endpoints = Array.from(nodes).slice(0, 4);
      const folded = {
        x: (index: number) => (index % 2 === 0 ? 169 : -169),
        y: (index: number) => (index < 2 ? 68 : -68),
        opacity: 0,
      };
      // Initialize every delayed child before ScrollTrigger's first refresh.
      // Otherwise a not-yet-rendered stagger child can show its static SVG pose.
      gsap.set(endpoints, folded);
      timeline
        .fromTo(
          nodes[4],
          { scale: 0.35, opacity: 0.2, svgOrigin: "280 130" },
          { scale: 1, opacity: 1, duration: 1 },
          0,
        )
        .fromTo(endpoints, folded, { x: 0, y: 0, opacity: 1, duration: 1.35, stagger: 0.15 }, 0.55)
        .fromTo(
          lines,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.4, ease: "none" },
          0.9,
        )
        .fromTo(
          visual.querySelector(".service-orbit"),
          { opacity: 0 },
          { opacity: 1, duration: 0.7 },
          1.8,
        );
      break;
    }
  }

  // A readable hold at the end; reverse scrolling retraces the same sequence.
  timeline.to({}, { duration: 0.6 });
}
