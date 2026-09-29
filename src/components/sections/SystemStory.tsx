"use client";
import { useMotionScene } from "@/hooks/useMotionScene";
import { systemTimeline } from "@/components/animations/systemTimeline";
import { homepageCopy } from "@/data/homepage";

import { SectionLabel } from "@/components/ui/SectionLabel";

const nodes = [
  { name: "Landing page", meta: "01 / CAPTURE", position: "node-one" },
  { name: "Form & survey", meta: "02 / QUALIFY", position: "node-two" },
  { name: "CRM & pipeline", meta: "03 / ORGANIZE", position: "node-three" },
  { name: "Email & SMS", meta: "04 / FOLLOW UP", position: "node-four" },
  { name: "API & webhook", meta: "05 / CONNECT", position: "node-five" },
  { name: "Appointment", meta: "06 / BOOK", position: "node-six" },
];
export function SystemStory() {
  const root = useMotionScene<HTMLElement>(systemTimeline);
  return (
    <section ref={root} className="system-section inverted" aria-labelledby="system-title">
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
            <path d="M170 65H350V180H500" />
            <path d="M830 65H650V180H500" />
            <path d="M170 180H500" />
            <path d="M830 180H500" />
            <path d="M170 295H350V180H500" />
            <path d="M830 295H650V180H500" />
          </svg>
          <div className="system-core">
            <span className="micro">THE STARTING POINT</span>
            <span className="micro core-workflow">WORKFLOW / AUTOMATION</span>
            <strong>LEAD</strong>
            <span className="core-bottom">
              <i className="status-dot" /> CONNECTED TO THE NEXT STEP
            </span>
          </div>
          {nodes.map((node) => (
            <div key={node.name} className={`system-node ${node.position}`} data-system-node>
              <span className="micro">{node.meta}</span>
              <strong>{node.name}</strong>
              <span className="node-port" aria-hidden="true" />
            </div>
          ))}
        </div>
        <p className="system-conclusion">
          BUILD SYSTEMS. <span>NOT JUST PAGES.</span>
        </p>
      </div>
    </section>
  );
}
