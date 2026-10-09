import Image from "next/image";
import { publishedProjects } from "@/data/projects";
import { homepageCopy } from "@/data/homepage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WebsiteConceptPreview } from "@/components/ui/website-concept-preview";
import { WebsiteShowcase } from "@/components/ui/website-showcase";
import { projectStatusLabel } from "@/lib/projectStatus";
import "@/styles/website-showcase.css";
export function Websites() {
  const projects = publishedProjects
    .filter((item) => ["Websites", "Funnels"].includes(item.category))
    .slice(0, 4);
  return (
    <section id="websites" className="websites-section section">
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
        {!!projects.length && (
          <WebsiteShowcase
            items={projects.map((project) => ({
              slug: project.slug,
              title: project.title,
              category: project.category,
              status: projectStatusLabel(project),
              summary: project.summary,
              tools: project.tools,
              preview: project.coverImage ? (
                <div className="showcase-image">
                  <Image
                    src={project.coverImage}
                    alt={project.coverAlt || project.title}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 900px) 90vw, 65vw"
                  />
                  {project.mobileImage && (
                    <Image
                      className="showcase-mobile-image"
                      src={project.mobileImage}
                      alt={`${project.title} mobile layout`}
                      width={300}
                      height={600}
                      sizes="(max-width: 700px) 25vw, 180px"
                    />
                  )}
                </div>
              ) : project.demoVisual ? (
                <WebsiteConceptPreview project={project} />
              ) : (
                <p className="showcase-placeholder">{project.title}</p>
              ),
            }))}
          />
        )}
        {!projects.length && (
          <p>Website and funnel case studies will appear here as projects are published.</p>
        )}
      </div>
    </section>
  );
}
