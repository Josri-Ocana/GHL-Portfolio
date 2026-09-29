"use client";
import { useMotionScene } from "@/hooks/useMotionScene";
import { workflowTimeline } from "@/components/animations/workflowTimeline";
import type { WorkflowStep } from "@/data/workflow";

function incomingPosition(steps: WorkflowStep[], index: number) {
  const branches = steps[index - 1]?.branches;
  const branchIndex = branches?.findIndex((branch) => branch.target === steps[index].key) ?? -1;
  return branches && branchIndex >= 0 ? `${((branchIndex + 0.5) / branches.length) * 100}%` : "50%";
}

/** Pass stable serializable steps to reuse in a case study. Static content is the default. */
export function WorkflowVisualization({
  steps,
  label = "ILLUSTRATIVE WORKFLOW / NOT CLIENT WORK",
  pinned = true,
}: {
  steps: WorkflowStep[];
  label?: string;
  pinned?: boolean;
}) {
  const root = useMotionScene<HTMLDivElement>(workflowTimeline);
  return (
    <div ref={root} className="technical-workflow" data-pin={pinned}>
      <div className="workflow-layout">
        <div className="workflow-diagram">
          <div className="diagram-toolbar">
            <span>AUTOMATION LOGIC</span>
            <span>{String(steps.length).padStart(2, "0")} STATES</span>
          </div>
          <ol className="logic-canvas" aria-label="Workflow steps and decision paths">
            {steps.map((step, i) => (
              <li className="logic-step" key={step.key} data-logic-step={step.key}>
                {i > 0 && (
                  <span
                    className="logic-connector"
                    style={{ left: incomingPosition(steps, i) }}
                    aria-hidden="true"
                  />
                )}
                <div className="logic-node">
                  <span className="micro logic-index">
                    {String(i + 1).padStart(2, "0")} / {step.label}
                  </span>
                  <strong>{step.title}</strong>
                  {step.route && <span className="logic-route micro">{step.route}</span>}
                  {step.actions && (
                    <ul className="logic-actions">
                      {step.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {step.branches && (
                  <ul className="logic-branches">
                    {step.branches.map((branch) => (
                      <li key={branch.label} data-branch-target={branch.target}>
                        <span className="micro">{branch.label}</span>
                        <strong>{branch.action}</strong>
                        <span className="logic-destination">
                          →{" "}
                          {steps.find((item) => item.key === branch.target)?.label || branch.target}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="logic-description">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="diagram-footer">{label}</div>
        </div>
        <div className="workflow-copy" aria-hidden="true">
          {steps.map((step, i) => (
            <article data-workflow-step={i} key={step.key}>
              <span className="micro">
                {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")} ·
                AUTOMATION LOGIC
              </span>
              <h3>
                <span data-step-word>{step.label}</span>
              </h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
