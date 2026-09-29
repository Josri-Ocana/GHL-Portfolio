import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";
import { safeExternalUrl } from "@/lib/media";
import { ProjectReveal } from "@/components/animations/ProjectReveal";
import { DemoVisual } from "./DemoVisual";
export function ProjectCard({
  project,
  headingLevel = 3,
  subtle = false,
}: {
  project: Project;
  headingLevel?: 2 | 3;
  subtle?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const cover = project.coverImage || project.video?.poster;
  return (
    <ProjectReveal subtle={subtle}>
      <article className="project-card">
        <Link
          href={`/work/${project.slug}`}
          className="project-cover"
          aria-label={`View ${project.title}`}
        >
          {cover ? (
            <Image
              src={cover}
              alt={project.coverAlt || `${project.title} preview`}
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
          ) : project.demoVisual ? (
            <DemoVisual project={project} />
          ) : (
            <div className="project-cover-type">
              <span className="micro">{project.category}</span>
              <span>{project.title}</span>
            </div>
          )}
          <span className="project-cover-label" aria-hidden="true">
            VIEW
          </span>
        </Link>
        <div className="project-meta">
          <span>
            {project.number && `${project.number} / `}
            {project.category}
          </span>
          <span>{project.isDemo ? "DEMO PROJECT" : project.status || project.year}</span>
        </div>
        <Heading className="project-title">
          <Link href={`/work/${project.slug}`}>{project.title}</Link>
        </Heading>
        <p>{project.summary}</p>
        <p className="micro">{project.tools.join(" / ")}</p>
        <Link
          className="text-link"
          href={`/work/${project.slug}`}
          aria-label={`View case study: ${project.title}`}
        >
          <span className="cta-label">View case study</span>
        </Link>
        {safeExternalUrl(project.liveUrl) && (
          <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <span className="cta-label">View live site</span>
          </a>
        )}
      </article>
    </ProjectReveal>
  );
}
