import type { Project } from "@/types/project";
import { projectStatusLabel } from "@/lib/projectStatus";
/** Original text-based documentation, never a screenshot of a real product. */
export function DemoVisual({ project }: { project: Project }) {
  const visual = project.demoVisual;
  if (!visual) return null;
  return (
    <div className={`demo-visual demo-visual--${visual.kind}`}>
      <div className="demo-visual-top micro">
        <span>CONCEPT / {project.number}</span>
        <span>{projectStatusLabel(project) || "DEMO PROJECT"}</span>
      </div>
      <p className="demo-headline">{visual.headline}</p>
      <ol className="demo-nodes">
        {visual.labels.map((label, index) => (
          <li key={label}>
            <span className="micro">{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            {visual.kind === "pipeline" && (
              <span className="demo-record" aria-hidden="true">
                —<br />
                ——
              </span>
            )}
          </li>
        ))}
      </ol>
      {visual.kind === "website" && (
        <div className="demo-page-bottom">
          <span className="demo-cta">{visual.action}</span>
          <span className="micro">PAGE → FORM → CRM</span>
        </div>
      )}
      <span className="demo-visual-foot micro">
        {visual.kind === "website" ? "ILLUSTRATIVE PAGE PREVIEW" : "ILLUSTRATIVE SYSTEM LOGIC"} /
        NOT A LIVE IMPLEMENTATION
      </span>
    </div>
  );
}
