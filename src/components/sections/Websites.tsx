import Image from "next/image";
import Link from "next/link";
import { publishedProjects } from "@/data/projects";
import { homepageCopy } from "@/data/homepage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DemoVisual } from "@/components/work/DemoVisual";
export function Websites() {
  const projects = publishedProjects
    .filter((item) => ["Websites", "Funnels"].includes(item.category))
    .slice(0, 4);
  return (
    <section className="websites-section section">
      <div className="wrap">
        <SectionLabel number="05">WEBSITES & FUNNELS</SectionLabel>
        <div className="section-heading">
          <h2>
            THE FRONT END.
            <br />
            WITH A BACK END.
          </h2>
          <p>
            {homepageCopy.websites.supporting[0]}
            <br />
            {homepageCopy.websites.supporting[1]}
          </p>
        </div>
        <div className="website-project-grid">
          {projects.map((project) => (
            <article className="website-project" key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                className="browser-frame"
                aria-label={`View case study: ${project.title}`}
              >
                <div className="browser-toolbar">
                  <span aria-hidden="true">● ● ●</span>
                  <span>{project.isDemo ? "DEMO PROJECT" : project.title}</span>
                </div>
                <div className="browser-image">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.coverAlt || project.title}
                      width={1600}
                      height={1000}
                      sizes="(max-width: 900px) 100vw, 85vw"
                    />
                  ) : project.demoVisual ? (
                    <DemoVisual project={project} />
                  ) : (
                    <div className="browser-placeholder">
                      <p>{project.title}</p>
                    </div>
                  )}
                  {project.mobileImage && (
                    <Image
                      className="mobile-preview"
                      src={project.mobileImage}
                      alt={`${project.title} mobile layout`}
                      width={300}
                      height={600}
                      sizes="(max-width: 700px) 30vw, 240px"
                    />
                  )}
                </div>
              </Link>
              <div className="project-meta">
                <span>
                  {project.number && `${project.number} / `}
                  {project.category}
                </span>
                <span>{project.isDemo ? "DEMO PROJECT" : project.year}</span>
              </div>
              <h3 className="project-title">{project.title}</h3>
              <div className="website-caption">
                <p>{project.summary}</p>
                <Link href={`/work/${project.slug}`} className="text-link">
                  <span className="cta-label">View case study</span>
                </Link>
              </div>
              <p className="micro">{project.tools.join(" / ")}</p>
            </article>
          ))}
        </div>
        {!projects.length && (
          <p>Website and funnel case studies will appear here as projects are published.</p>
        )}
      </div>
    </section>
  );
}
