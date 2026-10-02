import type { Project } from "@/types/project";
import { projectTimeline } from "@/lib/projectTimeline";
import Timeline from "@/components/ui/timeline";

export function CaseArchitecture({ project }: { project: Project }) {
  return (
    <section className="case-section case-architecture">
      <header className="architecture-heading">
        <h2>WORKFLOW &amp; ARCHITECTURE</h2>
        {project.demoVisual?.headline && (
          <p className="architecture-headline">{project.demoVisual.headline}</p>
        )}
        <p className="micro">
          {project.isDemo ? "ILLUSTRATIVE ARCHITECTURE / NOT CLIENT WORK" : "PROJECT ARCHITECTURE"}
        </p>
      </header>
      <Timeline key={project.slug} milestones={projectTimeline(project)} />
    </section>
  );
}
