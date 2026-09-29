import { processSteps } from "@/data/services";
import { homepageCopy } from "@/data/homepage";
import { SectionLabel } from "@/components/ui/SectionLabel";
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
      <ol className="process-grid">
        {processSteps.map((step, i) => (
          <li key={step.title}>
            <span className="process-number">0{i + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
