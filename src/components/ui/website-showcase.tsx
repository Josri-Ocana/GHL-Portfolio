"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useMotionScene } from "@/hooks/useMotionScene";
import { motion } from "@/lib/motion";

type ShowcaseItem = {
  slug: string;
  title: string;
  category: string;
  status?: string;
  summary: string;
  tools: string[];
  preview: ReactNode;
};

function entrance(root: HTMLElement) {
  const reveal = gsap.from(root.querySelector(".showcase-stage"), {
    y: 36,
    clipPath: "inset(0 0 12% 0)",
    duration: 0.85,
    ease: motion.ease,
    clearProps: "transform,clipPath",
    scrollTrigger: { trigger: root, start: "top 90%", toggleActions: "play none none none" },
  });
  const finish = () => reveal.progress(1);
  root.addEventListener("focusin", finish);
  root.addEventListener("pointerdown", finish);
  return () => {
    root.removeEventListener("focusin", finish);
    root.removeEventListener("pointerdown", finish);
  };
}

export function WebsiteShowcase({ items }: { items: ShowcaseItem[] }) {
  const [selected, setSelected] = useState(0);
  const root = useMotionScene<HTMLDivElement>(entrance);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const element = root.current;
    if (!element) return;
    const panel = element.querySelector<HTMLElement>("[data-showcase-panel][data-active='true']");
    const media = gsap.matchMedia();
    media.add(
      motion.allowed,
      () => {
        if (!panel) return;
        // React switches semantic content immediately; this context owns only incoming paint.
        // Revert kills interrupted tweens on rapid selection and preference changes.
        gsap
          .timeline({ defaults: { ease: motion.ease } })
          .fromTo(
            panel.querySelector(".showcase-content"),
            { y: 8, opacity: 0.82 },
            { y: 0, opacity: 1, duration: 0.32, clearProps: "transform,opacity" },
          )
          .fromTo(
            panel.querySelector(".showcase-caption"),
            { y: 6, opacity: 0.9 },
            { y: 0, opacity: 1, duration: 0.28, clearProps: "transform,opacity" },
            0,
          );
      },
      element,
    );
    return () => media.revert();
  }, [selected, root]);
  return (
    <div ref={root} className="website-showcase">
      <div className="showcase-index" role="group" aria-label="Choose a website or funnel project">
        <div className="showcase-index-heading micro">
          <span>PROJECT INDEX</span>
          <span>01 — {String(items.length).padStart(2, "0")}</span>
        </div>
        {items.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            className="showcase-select"
            aria-pressed={selected === index}
            aria-controls={`showcase-${item.slug}`}
            onClick={() => setSelected(index)}
          >
            <span className="showcase-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="showcase-select-copy">
              <span className="micro">{item.category}</span>
              <strong>
                <span>{item.title}</span>
                <span className="showcase-title-measure" aria-hidden="true">
                  {item.title}
                </span>
              </strong>
            </span>
            <span className="showcase-indicator" aria-hidden="true" />
          </button>
        ))}
        <p className="showcase-index-note">
          Select an experience.
          <br />
          Explore the system behind it.
        </p>
      </div>
      <div className="showcase-stage">
        <div className="showcase-stage-bar micro">
          <span>INTERFACE / SYSTEM</span>
          <span aria-live="polite" aria-atomic="true">
            {String(selected + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>
        <div className="showcase-panels">
          {items.map((item, index) => (
            <article
              key={item.slug}
              id={`showcase-${item.slug}`}
              data-showcase-panel
              data-active={selected === index}
              data-presentation={index % 4}
              aria-labelledby={`showcase-title-${item.slug}`}
              aria-hidden={selected !== index}
              inert={selected !== index}
            >
              <div className="showcase-preview">
                <div className="showcase-browser-bar micro">
                  <span aria-hidden="true" className="showcase-browser-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>{item.status}</span>
                </div>
                <div className="showcase-content">{item.preview}</div>
              </div>
              <div className="showcase-caption">
                <div className="showcase-caption-copy">
                  <h3 id={`showcase-title-${item.slug}`}>{item.title}</h3>
                  <p>{item.summary}</p>
                  <p className="micro showcase-tools">{item.tools.join(" / ")}</p>
                </div>
                <Link className="text-link" href={`/work/${item.slug}`}>
                  <span className="cta-label">View case study</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
