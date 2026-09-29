import { SectionLabel } from "@/components/ui/SectionLabel";
import { WorkflowVisualization } from "@/components/work/WorkflowVisualization";
import { technicalWorkflow } from "@/data/workflow";
export function WorkflowShowcase() {
  return (
    <section className="workflow-section section wrap" aria-labelledby="workflow-title">
      <SectionLabel number="04">INSIDE THE WORKFLOW</SectionLabel>
      <div className="section-heading">
        <h2 id="workflow-title">
          BEHIND EVERY LEAD.
          <br />
          THERE’S A WORKFLOW.
        </h2>
        <p>
          An illustrative automation.
          <br />
          The trigger, actions, and decisions behind the follow-up.
        </p>
      </div>
      <WorkflowVisualization steps={technicalWorkflow} />
    </section>
  );
}
