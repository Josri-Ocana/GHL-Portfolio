import Link from "next/link";
import { publishedProjects } from "@/data/projects";
import { ProjectCard } from "@/components/work/ProjectCard";
import { EmptyWork } from "@/components/work/EmptyWork";
import { SectionLabel } from "@/components/ui/SectionLabel";
export function SelectedWork() {
  const selected = publishedProjects.filter((project) => project.featured).slice(0, 3);
  const visible = selected.length ? selected : publishedProjects.slice(0, 3);
  return (
    <section id="work" className="section wrap">
      <SectionLabel number="03">PROOF OF WORK</SectionLabel>
      <div className="section-heading" data-reveal>
        <h2>SELECTED WORK.</h2>
        <Link href="/work" className="text-link">
          <span className="cta-label">Explore all work</span>
        </Link>
      </div>
      {visible.some((project) => project.isDemo) && (
        <p className="demo-notice micro">DEMO PROJECTS / ILLUSTRATIVE CONCEPTS, NOT CLIENT WORK.</p>
      )}
      {visible.length ? (
        <div className="project-grid featured-project-grid">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <EmptyWork />
      )}
    </section>
  );
}
