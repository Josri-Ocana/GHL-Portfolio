import gsap from "gsap";
import { motion, type MotionConditions } from "@/lib/motion";

export function workflowTimeline(root: HTMLElement, { desktop }: MotionConditions) {
  const layout = root.querySelector<HTMLElement>(".workflow-layout")!;
  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-logic-step]"));
  if (!desktop || root.dataset.pin !== "true") {
    steps.forEach((step) =>
      gsap.from(step, {
        y: 18,
        opacity: 0.4,
        duration: 0.6,
        clearProps: "all",
        scrollTrigger: { trigger: step, start: "top 94%", toggleActions: "play none none none" },
      }),
    );
    return;
  }
  const articles = Array.from(root.querySelectorAll<HTMLElement>("[data-workflow-step]"));
  const nodes = steps.map((step) => step.querySelector<HTMLElement>(".logic-node")!);
  const lines = root.querySelectorAll(".logic-connector");
  root.classList.add("workflow-cinematic");
  gsap.set(nodes, { opacity: 0.16, y: 8 });
  gsap.set(lines, { scaleY: 0, transformOrigin: "top center" });
  gsap.set(root.querySelectorAll(".logic-actions"), { clipPath: "inset(0 100% 0 0)", opacity: 0 });
  gsap.set(root.querySelectorAll(".logic-branches"), { clipPath: "inset(0 0 100% 0)", opacity: 0 });
  gsap.set(articles.slice(1), { opacity: 0 });
  gsap.set(
    articles.slice(1).map((article) => article.querySelector("[data-step-word]")),
    { yPercent: 110 },
  );
  const timeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      id: "technical-workflow",
      trigger: layout,
      start: () =>
        `top top+=${Math.max(24, Math.round((window.innerHeight - layout.offsetHeight) / 2))}`,
      end: () => `+=${Math.round(window.innerHeight * motion.workflowDistance.desktop)}`,
      pin: true,
      scrub: motion.scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 1,
    },
  });
  steps.forEach((step, i) => {
    const time = i * 1.25;
    const line = step.querySelector(".logic-connector");
    if (line) timeline.to(line, { scaleY: 1, duration: 0.35, ease: "none" }, time);
    if (i > 0) {
      timeline.to(
        nodes[i - 1],
        { backgroundColor: "#e8e8e5", color: "#555", borderColor: "#aaa", duration: 0.35 },
        time,
      );
      timeline.to(
        articles[i - 1].querySelector("[data-step-word]"),
        { yPercent: -110, duration: 0.5 },
        time,
      );
      timeline.to(articles[i - 1], { opacity: 0, duration: 0.5 }, time);
      timeline.to(articles[i], { opacity: 1, duration: 0.5 }, time);
      timeline.to(
        articles[i].querySelector("[data-step-word]"),
        { yPercent: 0, duration: 0.5 },
        time,
      );
    }
    timeline.to(
      nodes[i],
      {
        opacity: 1,
        y: 0,
        backgroundColor: "#0a0a0a",
        color: "#fff",
        borderColor: "#0a0a0a",
        duration: 0.4,
      },
      time + (i ? 0.25 : 0),
    );
    const actions = step.querySelector(".logic-actions");
    if (actions)
      timeline.to(
        actions,
        { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.45 },
        time + 0.55,
      );
    const branches = step.querySelector(".logic-branches");
    if (branches)
      timeline.to(
        branches,
        { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.55 },
        time + 0.5,
      );
    const branch = Array.from(root.querySelectorAll<HTMLElement>("[data-branch-target]")).find(
      (item) => item.dataset.branchTarget === step.dataset.logicStep,
    );
    if (branch)
      timeline.to(
        branch,
        { backgroundColor: "#0a0a0a", color: "#fff", borderColor: "#0a0a0a", duration: 0.4 },
        time + 0.25,
      );
    timeline.addLabel(`workflow-${step.dataset.logicStep}`, time + 0.9);
  });
  timeline
    .to(nodes, { opacity: 1, borderColor: "#0a0a0a", duration: 0.35 }, ">.1")
    .to(
      root.querySelectorAll(".logic-branches li"),
      { backgroundColor: "#e8e8e5", color: "#333", duration: 0.3 },
      "<",
    )
    .to({}, { duration: 0.8 });
  return () => root.classList.remove("workflow-cinematic");
}
