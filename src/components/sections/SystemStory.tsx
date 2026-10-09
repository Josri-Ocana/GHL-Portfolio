"use client";
import { useMotionScene } from "@/hooks/useMotionScene";
import { systemTimeline } from "@/components/animations/systemTimeline";
import { homepageCopy } from "@/data/homepage";
import { systemOverviewNodes } from "@/data/systemOverview";
import "@/styles/system-overview.css";

import { SectionLabel } from "@/components/ui/SectionLabel";

export function SystemStory() {
  const root = useMotionScene<HTMLElement>(systemTimeline);
  return (
    <section
      ref={root}
      className="system-section system-overview inverted"
      aria-labelledby="system-title"
    >
      <div className="system-to-work-canvas" aria-hidden="true" />
      <div className="wrap">
        <div className="system-top">
          <SectionLabel number="02">{homepageCopy.system.label}</SectionLabel>
          <span className="micro">ILLUSTRATIVE ARCHITECTURE / NOT A CLIENT PROJECT</span>
        </div>
        <div className="system-heading">
          <h2 id="system-title">
            ONE LEAD.
            <br />
            EVERY NEXT STEP.
          </h2>
          <p>
            {homepageCopy.system.supporting[0]}
            <br />
            {homepageCopy.system.supporting[1]}
          </p>
        </div>
        <div className="system-canvas">
          <svg
            className="system-lines"
            viewBox="0 0 1000 360"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M500 180H350V65H170" />
            <path d="M500 180H650V65H830" />
            <path d="M500 180H170" />
            <path d="M500 180H830" />
            <path d="M500 180H350V295H170" />
            <path d="M500 180H650V295H830" />
          </svg>
          <div className="system-core">
            <span className="system-core-pulse" aria-hidden="true" />
            <span className="micro">THE STARTING POINT</span>
            <span className="micro core-workflow">WORKFLOW / AUTOMATION</span>
            <strong>LEAD</strong>
            <span className="core-bottom">
              <i className="status-dot" /> CONNECTED TO THE NEXT STEP
            </span>
          </div>
          {systemOverviewNodes.map((node, i) => (
            <div key={node.name} className={`system-node ${node.position}`} data-system-node>
              <span className="system-node-number" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="micro">
                {String(i + 1).padStart(2, "0")} / {node.stage}
              </span>
              <svg
                className="system-node-symbol"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                aria-hidden="true"
              >
                <path d={node.symbol} />
              </svg>
              <strong>{node.name}</strong>
              <span className="node-port" aria-hidden="true" />
            </div>
          ))}
        </div>
        <div className="system-sequence" aria-hidden="true">
          {systemOverviewNodes.map((node, i) => (
            <span key={node.stage}>
              <i data-system-progress />
              <b>{String(i + 1).padStart(2, "0")}</b> {node.stage}
            </span>
          ))}
        </div>
        <p className="system-conclusion">
          BUILD SYSTEMS. <span>NOT JUST PAGES.</span>
        </p>
      </div>
    </section>
  );
}
