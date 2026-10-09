import type { Project } from "@/types/project";
import { websitePresentations } from "@/data/websiteShowcase";

/** Homepage-only editorial concepts, using approved preview and workflow copy. */
export function WebsiteConceptPreview({ project }: { project: Project }) {
  const visual = project.demoVisual;
  if (!visual) return null;
  const presentation = websitePresentations[project.slug] || "service";
  return (
    <div className={`website-concept website-concept--${presentation}`}>
      <div className="concept-top micro">
        <span>CONCEPT / {project.number}</span>
        <span>{project.category}</span>
      </div>
      <div className="concept-main">
        <div className="concept-heading">
          <p>{visual.headline}</p>
          <span className="concept-action">{visual.action}</span>
        </div>
        <ol className="concept-features">
          {visual.labels.map((label, index) => (
            <li key={label}>
              <span className="micro">{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
            </li>
          ))}
        </ol>
      </div>
      {project.workflowSteps?.length && (
        <ol className="concept-journey" aria-label="Proposed visitor journey">
          {project.workflowSteps.map((step, index) => (
            <li key={step.id || step.title}>
              <span className="micro">{String(index + 1).padStart(2, "0")}</span>
              <span>{step.title}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="concept-disclaimer micro">
        ILLUSTRATIVE PAGE PREVIEW / NOT A LIVE IMPLEMENTATION
      </p>
    </div>
  );
}
