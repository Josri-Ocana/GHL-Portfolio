import { processSteps } from "@/data/services";
import { homepageCopy } from "@/data/homepage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import "@/styles/process.css";
export function Process() {
  return (
    <section id="process" className="section wrap">
      <SectionLabel number="06">HOW I WORK</SectionLabel>
      <div className="section-heading">
        <h2>
          {homepageCopy.process.headline[0]}
          <br />
          {homepageCopy.process.headline[1]}
        </h2>
        <p>
          Understand it first.
          <br />
          Test it all the way through.
        </p>
      </div>
      <div className="process-boundary" aria-hidden="true">
        <span>01 / Start with understanding</span>
        <span>06 / Keep improving</span>
      </div>
      <div className="process-track">
        <div className="process-rail" aria-hidden="true">
          <span className="process-progress" />
        </div>
        <ol className="process-sequence">
          {processSteps.map((step, i) => (
            <li className="process-stage" key={step.title}>
              <span className="process-marker" aria-hidden="true" />
              <span className="process-step-number" aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
