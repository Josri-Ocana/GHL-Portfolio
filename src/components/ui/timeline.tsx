// Adapted from the supplied Hyperiux Vault timeline: https://vault.hyperiux.com
"use client";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useMotionScene } from "@/hooks/useMotionScene";
import type { TimelineMilestone } from "@/lib/projectTimeline";
import { WorkflowIcon } from "./WorkflowIcon";

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  milestones: TimelineMilestone[];
  duration?: number;
};

export default function Timeline({
  title = "WORKFLOW & ARCHITECTURE",
  periodLabel = "WORKFLOW SEQUENCE",
  milestones,
  duration = 1.2,
}: TimelineProps) {
  const normalizedDuration = Math.max(0.2, duration);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const setup = useCallback(
    (section: HTMLElement) => {
      if (!measuredWidth) return;
      // Preference/context ownership stays with the shared hook. This query only
      // switches the supplied desktop interaction to the small-screen fallback.
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 700px) and (min-height: 560px)",
        () => {
          gsap.registerPlugin(SplitText);
          section.classList.add("timeline-enhanced");
          const wholeSlider = section.querySelector<HTMLElement>(".wholeSlider")!;
          const viewport = section.querySelector<HTMLElement>(".timeline-viewport")!;
          const journeyLine = section.querySelector<HTMLElement>(".journey-line")!;
          const items = Array.from(section.querySelectorAll<HTMLElement>(".journey-item")).sort(
            (a, b) => Number(a.dataset.index) - Number(b.dataset.index),
          );
          const splits: SplitText[] = [];
          const measure = () => {
            const travel = Math.max(0, wholeSlider.offsetWidth - viewport.clientWidth);
            gsap.set(section, { "--timeline-travel": `${travel * 1.25}px` });
          };
          measure();
          // Retains the supplied wholeSlider xPercent tween and sticky viewport.
          const horizontalTimeline = gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "92% bottom",
                scrub: true,
                invalidateOnRefresh: true,
                onRefreshInit: measure,
              },
              defaults: { ease: "none" },
            })
            .fromTo(
              wholeSlider,
              { xPercent: 0 },
              {
                xPercent: () =>
                  (-100 * Math.max(0, wholeSlider.offsetWidth - viewport.clientWidth)) /
                  wholeSlider.offsetWidth,
              },
            );
          // As supplied: a separate scrubbed horizontal line grows across the map.
          gsap.fromTo(
            journeyLine,
            { width: "0%" },
            {
              width: "98%",
              ease: "none",
              scrollTrigger: { trigger: section, start: "top 25%", end: "92% bottom", scrub: true },
            },
          );
          items.forEach((item, index) => {
            item.dataset.state = "upcoming";
            item.querySelector(".journey-state")!.textContent = "NEXT";
            const stem = item.querySelector<HTMLElement>(".journey-stem")!;
            const dot = item.querySelector<HTMLElement>(".journey-dot")!;
            const titleElement = item.querySelector<HTMLElement>(".journey-title")!;
            const descriptionElement = item.querySelector<HTMLElement>(".journey-description");
            gsap.set(stem, {
              scaleY: 0,
              transformOrigin: item.dataset.position === "top" ? "bottom bottom" : "top top",
            });
            gsap.set(dot, { scale: 0 });
            const titleSplit = new SplitText(titleElement, { type: "words, lines", mask: "lines" });
            splits.push(titleSplit);
            const descriptionSplit = descriptionElement
              ? new SplitText(descriptionElement, { type: "words, lines", mask: "lines" })
              : null;
            if (descriptionSplit) splits.push(descriptionSplit);
            // Source [6,26] ... [65,85], generalized to any workflow length.
            const startPos = 6 + (index * 59) / Math.max(1, items.length - 1);
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: `${startPos}% 30%`,
                end: `${startPos + 20}% 50%`,
                scrub: true,
                onUpdate: (trigger) => {
                  item.dataset.state =
                    trigger.progress >= 1
                      ? "completed"
                      : trigger.progress > 0
                        ? "active"
                        : "upcoming";
                  item.querySelector(".journey-state")!.textContent =
                    trigger.progress >= 1 ? "DONE" : trigger.progress > 0 ? "CURRENT" : "NEXT";
                },
              },
            });
            // Preserve the source's activation clock and shifted stem/dot timing.
            // Its negative text delay previously shifted stem start to 0.4 × duration.
            const activationDuration =
              normalizedDuration +
              0.02 * (Math.max(titleSplit.lines.length, descriptionSplit?.lines.length || 0) - 1);
            timeline.to({}, { duration: activationDuration }, 0);
            timeline
              .to(stem, { scaleY: 1, duration: normalizedDuration * 0.4 }, normalizedDuration * 0.4)
              .to(dot, { scale: 1, duration: normalizedDuration * 0.4 }, "<");
            // Copy follows actual viewport entry, rather than the source's
            // section-percent marker windows (which drift on longer workflows).
            const copyTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                containerAnimation: horizontalTimeline,
                horizontal: true,
                start: "left 90%",
                end: "left 65%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            copyTimeline.fromTo(
              titleSplit.lines,
              { y: 22, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: normalizedDuration * 0.18,
                stagger: 0.01,
                ease: "power2.out",
              },
              0,
            );
            if (descriptionSplit)
              copyTimeline.fromTo(
                descriptionSplit.lines,
                { y: 22, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: normalizedDuration * 0.2,
                  stagger: 0.01,
                  ease: "power2.out",
                },
                normalizedDuration * 0.03,
              );
            // Overlap the small icon reveal within the existing duration/windows.
            timeline.fromTo(
              item.querySelector(".journey-icon"),
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: normalizedDuration * 0.3, ease: "power2.out" },
              descriptionSplit ? 0 : normalizedDuration * 0.4,
            );
          });
          return () => {
            splits.forEach((split) => split.revert());
            section.classList.remove("timeline-enhanced");
            items.forEach((item) => {
              delete item.dataset.state;
              item.querySelector(".journey-state")!.textContent = "DETAIL";
            });
          };
        },
        section,
      );
      return () => media.revert();
    },
    [normalizedDuration, measuredWidth],
  );
  const sectionRef = useMotionScene<HTMLElement>(setup);
  // Revert/rebuild source SplitText masks when available width changes. Refreshing
  // only trigger geometry would preserve obsolete line wrapping after a resize.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new ResizeObserver(([entry]) =>
      setMeasuredWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);
  const topJourneyData = milestones.filter((item) => item.position === "top");
  const bottomJourneyData = milestones.filter((item) => item.position === "bottom");
  const renderMilestone = (item: TimelineMilestone) => (
    <li
      key={item.id}
      className="journey-item"
      data-position={item.position}
      data-index={item.index}
      style={{ "--milestone-index": item.index } as CSSProperties}
    >
      <div className="journey-marker">
        {item.position === "top" && <span className="journey-dot" />}
        <span className="journey-stem" />
        {item.position === "bottom" && <span className="journey-dot" />}
      </div>
      <div className="journey-copy">
        <p className="micro journey-step">
          {item.step} / <span className="journey-state">DETAIL</span>
        </p>
        <span className="journey-icon">
          <WorkflowIcon name={item.icon} />
        </span>
        <h3 className="journey-title">{item.title}</h3>
        {item.label && <p className="micro journey-label">{item.label}</p>}
        {item.description && <p className="journey-description">{item.description}</p>}
      </div>
    </li>
  );
  return (
    <section
      ref={sectionRef}
      className="workflow-timeline"
      style={{ "--milestone-count": milestones.length } as CSSProperties}
      aria-label={title}
    >
      <div className="timeline-viewport" aria-hidden="true">
        <div className="wholeSlider">
          <div className="timeline-intro">
            <p className="micro">{periodLabel}</p>
            <p className="timeline-intro-title">{title}</p>
            <p className="micro">SCROLL TO FOLLOW THE HANDOFF</p>
          </div>
          <div className="timeline-map">
            <div className="journey-axis">
              <span className="journey-axis-dot" />
              <span className="journey-line" />
              <span className="journey-axis-end" />
            </div>
            <ol className="journey-top">{topJourneyData.map(renderMilestone)}</ol>
            <ol className="journey-bottom">{bottomJourneyData.map(renderMilestone)}</ol>
          </div>
        </div>
      </div>
      <ol className="timeline-static">
        {milestones.map((item) => (
          <li key={item.id}>
            <span className="micro">{item.step}</span>
            <div>
              <span className="journey-icon">
                <WorkflowIcon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              {item.label && <p className="micro">{item.label}</p>}
              {item.description && <p>{item.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
