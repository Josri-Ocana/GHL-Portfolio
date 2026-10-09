import gsap from "gsap";
import { motion, type MotionConditions } from "@/lib/motion";

export function systemTimeline(root: HTMLElement, { desktop, tablet }: MotionConditions) {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-system-node]"));
  const paths = Array.from(root.querySelectorAll<SVGPathElement>(".system-lines path"));
  const core = root.querySelector(".system-core");
  const conclusion = root.querySelector(".system-conclusion");
  const progress = Array.from(root.querySelectorAll<HTMLElement>("[data-system-progress]"));
  const pulse = root.querySelector(".system-core-pulse");
  const sequence = root.querySelector(".system-sequence");
  const pin = (desktop || tablet) && root.offsetHeight < window.innerHeight - 16;
  if (!pin) {
    nodes.forEach((node, i) =>
      gsap.from(node, {
        opacity: 0,
        y: 36,
        clipPath: "inset(0 0 100% 0)",
        duration: 0.8,
        delay: (i % 2) * 0.08,
        ease: motion.ease,
        clearProps: "all",
        scrollTrigger: { trigger: node, start: "top 92%", toggleActions: "play none none none" },
      }),
    );
    gsap.from(conclusion, {
      y: 28,
      opacity: 0,
      duration: motion.reveal,
      clearProps: "all",
      scrollTrigger: {
        trigger: conclusion,
        start: "top 94%",
        toggleActions: "play none none none",
      },
    });
    return;
  }
  root.classList.add("system-cinematic");
  const origins = [
    [-150, -75],
    [150, -75],
    [-180, 0],
    [180, 0],
    [-140, 75],
    [140, 75],
  ];
  const strength = desktop ? 1.3 : 1;
  gsap.set(nodes, {
    opacity: 0,
    scale: 0.78,
    clipPath: "inset(0 0 100% 0)",
    x: (i) => origins[i][0] * strength,
    y: (i) => origins[i][1] * strength,
  });
  gsap.set(progress, { scaleX: 0 });
  paths.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  });
  gsap.set(conclusion, { opacity: 0, y: 35 });
  const workflow = root.querySelector(".core-workflow");
  gsap.set(workflow, { display: "block", opacity: 0 });
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "automation-system",
      trigger: root,
      start: "top top+=8",
      pin: true,
      end: () =>
        `+=${Math.round(window.innerHeight * (desktop ? motion.systemDistance.desktop : motion.systemDistance.tablet))}`,
      scrub: motion.scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 2,
    },
  });
  timeline.to(core, { scale: 1.07, duration: 0.5 }).addLabel("lead");
  nodes.forEach((node, i) => {
    const time = 0.8 + i * 0.8 + (i >= 3 ? 0.8 : 0);
    timeline
      .to(paths[i], { strokeDashoffset: 0, duration: 0.5, ease: "none" }, time)
      .to(paths[i], { stroke: "#c65a24", duration: 0.12 }, time)
      .to(
        node,
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.6,
          ease: "power3.out",
        },
        time + 0.12,
      )
      .to(node, { borderColor: "#c65a24", backgroundColor: "#24201d", duration: 0.2 }, time + 0.12)
      .to(
        node.querySelector(".system-node-symbol"),
        { color: "#c65a24", duration: 0.2 },
        time + 0.12,
      )
      .to(progress[i], { scaleX: 1, duration: 0.65, ease: "none" }, time)
      .fromTo(
        pulse,
        { scale: 1, opacity: 0.7 },
        { scale: 1.2, opacity: 0, duration: 0.65, immediateRender: false, ease: "power2.out" },
        time,
      )
      .to(node, { borderColor: "#666666", backgroundColor: "#181818", duration: 0.25 }, time + 0.78)
      .to(
        node.querySelector(".system-node-symbol"),
        { color: "#aaaaaa", duration: 0.25 },
        time + 0.78,
      )
      .to(paths[i], { stroke: "#777777", duration: 0.25 }, time + 0.78)
      .addLabel(`connected-${i + 1}`, time + 0.77);
  });
  timeline
    .to(
      root.querySelector(".system-core > .micro:not(.core-workflow)"),
      { opacity: 0, duration: 0.3 },
      3.25,
    )
    .to(workflow, { opacity: 1, duration: 0.5 }, 3.25)
    .addLabel("workflow", 3.75);
  timeline
    .to(core, { scale: 1, duration: 1.1 }, 6.4)
    .addLabel("ecosystem")
    .to(sequence, { opacity: 0, y: 12, duration: 0.4 }, ">.35")
    .to(
      nodes,
      {
        x: (i) => origins[i][0] * 0.85 * strength,
        y: (i) => (i % 2 ? 65 : -65) * strength,
        opacity: 0,
        scale: 0.7,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.in",
      },
      "<",
    )
    .to(
      paths,
      {
        strokeDashoffset: (i) => paths[i].getTotalLength(),
        stagger: 0.07,
        duration: 0.65,
        ease: "none",
      },
      "<",
    )
    .to(core, { opacity: 0, scale: 0.86, duration: 0.8 }, "<.2")
    .to(
      conclusion,
      {
        opacity: 1,
        y: () => -root.querySelector<HTMLElement>(".system-canvas")!.offsetHeight * 0.7,
        scale: desktop ? 1.2 : 1.05,
        duration: 0.9,
        ease: motion.ease,
      },
      "<.15",
    )
    .addLabel("resolution")
    .to({}, { duration: 0.8 });
  return () => root.classList.remove("system-cinematic");
}
