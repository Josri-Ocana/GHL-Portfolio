import gsap from "gsap";
import { motion } from "@/lib/motion";

/** Decorative progression only: content never waits for a reveal or changes position. */
export function processMotion(root: HTMLElement) {
  const sequence = root.querySelector<HTMLElement>(".process-track");
  const progress = sequence?.querySelector<HTMLElement>(".process-progress");
  if (!sequence || !progress) return;
  const stages = Array.from(sequence.querySelectorAll<HTMLElement>(".process-stage"));
  let thresholds: number[] = [];
  let active = -2;
  const measure = () => {
    thresholds = stages.map((stage) => {
      const marker = stage.querySelector<HTMLElement>(".process-marker")!;
      return (stage.offsetTop + marker.offsetTop + marker.offsetHeight / 2) / sequence.offsetHeight;
    });
    active = -2;
  };
  const update = (value: number) => {
    const index = thresholds.findLastIndex((threshold) => value >= threshold);
    if (index === active) return;
    active = index;
    stages.forEach((stage, i) => {
      stage.dataset.processState = i < index ? "complete" : i === index ? "current" : "upcoming";
    });
  };
  measure();
  gsap.fromTo(
    progress,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      onUpdate() {
        update(Number(gsap.getProperty(progress, "scaleY")));
      },
      scrollTrigger: {
        trigger: sequence,
        start: "top 65%",
        end: "bottom 55%",
        scrub: motion.scrub,
        invalidateOnRefresh: true,
        onRefresh() {
          measure();
          update(Number(gsap.getProperty(progress, "scaleY")));
        },
      },
    },
  );
  return () =>
    stages.forEach((stage) => {
      delete stage.dataset.processState;
    });
}
