import Image from "next/image";
import { PageMotion } from "@/components/animations/PageMotion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, publishedProjects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { pageMetadata } from "@/data/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectWalkthrough } from "@/components/media/ProjectWalkthrough";
import { DemoVisual } from "@/components/work/DemoVisual";
import { CaseArchitecture } from "@/components/work/CaseArchitecture";
import { caseContent } from "@/lib/projectContent";
import { safeExternalUrl } from "@/lib/media";
import { WorkflowCanvas } from "@/components/ui/WorkflowCanvas";
import { projectCanvas } from "@/lib/workflowCanvas";
import { projectStatusLabel } from "@/lib/projectStatus";
export function generateStaticParams() {
  return publishedProjects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return {
    ...pageMetadata(
      project.seo?.title ||
        `${project.status === "concept" ? "Concept — " : project.isDemo || project.status === "built-demo" ? "Demo — " : ""}${project.title}`,
      project.seo?.description || project.description || project.summary,
      `/work/${project.slug}`,
    ),
    ...(project.isDemo || project.status === "concept" || project.status === "built-demo"
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const content = caseContent(project);
  const concept = project.status === "concept";
  const isWebsite = ["Websites", "Funnels"].includes(project.category);
  const visualization = project.workflowVisualization;
  const overview = visualization?.type === "timeline" ? visualization.overview : undefined;
  const next =
    publishedProjects[
      (publishedProjects.findIndex((item) => item.slug === slug) + 1) % publishedProjects.length
    ];
  const links = concept
    ? []
    : [
        { label: "Visit live site", url: project.liveUrl },
        { label: "View repository", url: project.repositoryUrl },
        ...(project.resources || []),
      ].filter((link) => safeExternalUrl(link.url));
  return (
    <PageMotion>
      <main id="main" className="wrap case-page">
        {!project.isDemo && !concept && project.status !== "built-demo" && (
          <JsonLd
            data={[
              {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                name: project.title,
                description: project.summary,
                url: `${siteConfig.url}/work/${project.slug}`,
                creator: { "@type": "Person", name: siteConfig.name },
                ...(project.coverImage
                  ? { image: new URL(project.coverImage, siteConfig.url).href }
                  : {}),
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Work",
                    item: `${siteConfig.url}/work`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: project.title,
                    item: `${siteConfig.url}/work/${project.slug}`,
                  },
                ],
              },
            ]}
          />
        )}
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/work">Work</Link>
          <span>/</span>
          <span aria-current="page">{project.title}</span>
        </nav>
        <header className="case-header">
          <p className="micro">
            {concept
              ? "CONCEPT / "
              : project.status
                ? `${projectStatusLabel(project)} / `
                : project.isDemo && "DEMO PROJECT / "}
            {project.category} {project.year && `/ ${project.year}`}
          </p>
          <h1>{project.title}</h1>
          {concept && (
            <p className="micro">
              PROPOSED SYSTEM — NOT YET IMPLEMENTED, TESTED OR DELIVERED TO A CLIENT.
            </p>
          )}
          <p className="lead">{project.summary}</p>
          <dl className="case-facts">
            {project.role && (
              <div>
                <dt>ROLE</dt>
                <dd>{project.role}</dd>
              </div>
            )}
            <div>
              <dt>{concept ? "PROPOSED TOOLS" : "TOOLS"}</dt>
              <dd>{project.tools.join(" / ")}</dd>
            </div>
            {project.status && (
              <div>
                <dt>STATUS</dt>
                <dd>{projectStatusLabel(project)}</dd>
              </div>
            )}
            {project.confidential ? (
              <div>
                <dt>CLIENT</dt>
                <dd>Confidential</dd>
              </div>
            ) : (
              project.clientName && (
                <div>
                  <dt>CLIENT</dt>
                  <dd>{project.clientName}</dd>
                </div>
              )
            )}
          </dl>
        </header>
        <div className="case-sections">
          {content.challenge.length > 0 && (
            <section className="case-text" data-reveal>
              <h2>{concept ? "Business Problem" : "Challenge"}</h2>
              <div>
                {content.challenge.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </section>
          )}
          {project.solution && (
            <section className="case-text" data-reveal>
              <h2>{concept ? "Proposed Solution" : "Solution"}</h2>
              <p>{project.solution}</p>
            </section>
          )}
        </div>
        {!concept && (project.coverImage || (isWebsite && project.demoVisual) || overview) && (
          <section className="case-section">
            <h2>
              {isWebsite
                ? "DESKTOP PREVIEW"
                : overview && !project.coverImage
                  ? "SYSTEM OVERVIEW"
                  : "PROJECT PREVIEW"}
            </h2>
            {project.coverImage ? (
              <Image
                className="case-cover"
                src={project.coverImage}
                alt={project.coverAlt || project.title}
                width={1600}
                height={1000}
                sizes="(max-width: 900px) 100vw, 85vw"
              />
            ) : overview ? (
              <>
                <p className="micro workflow-canvas-caption">
                  KEY HANDOFFS / FULL DECISION LOGIC BELOW
                </p>
                <WorkflowCanvas
                  key={`${project.slug}-overview`}
                  {...projectCanvas(project, overview)}
                  label={`${project.title} — simplified system overview`}
                />
              </>
            ) : (
              <DemoVisual project={project} />
            )}
          </section>
        )}
        {!concept && project.mobileImage && (
          <section className="case-section">
            <h2>MOBILE PREVIEW</h2>
            <Image
              className="case-mobile-preview"
              src={project.mobileImage}
              alt={`${project.title} mobile layout`}
              width={390}
              height={844}
              sizes="(max-width: 600px) 90vw, 390px"
            />
          </section>
        )}
        {(!!project.workflowSteps?.length ||
          (visualization?.type === "canvas" && !!visualization.nodes?.length)) &&
          (!isWebsite || concept) && <CaseArchitecture project={project} />}
        {(!!project.workflowSteps?.length ||
          (visualization?.type === "canvas" && !!visualization.nodes?.length)) &&
          isWebsite &&
          !concept &&
          visualization?.type !== "none" && (
            <section className="case-section">
              <h2>{isWebsite ? "PAGE TO CRM" : "WORKFLOW & ARCHITECTURE"}</h2>
              <WorkflowCanvas
                key={`${project.slug}-page-to-crm`}
                interaction="drag-nodes"
                {...projectCanvas(project, visualization?.type === "canvas" ? visualization : {})}
                label={`${project.title} — page to CRM`}
              />
            </section>
          )}
        {!concept &&
          (project.video || (project.isDemo && !project.status && project.demoVideoSlot)) && (
            <section className="case-section">
              <h2>VIDEO WALKTHROUGH</h2>
              <ProjectWalkthrough project={project} />
            </section>
          )}
        {!concept && !!project.gallery?.length && (
          <section className="case-section">
            <h2>A CLOSER LOOK</h2>
            <div className="gallery">
              {project.gallery.map((item) => (
                <figure key={item.src}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1400}
                    height={900}
                    sizes="(max-width: 900px) 100vw, 80vw"
                  />
                  {item.caption && <figcaption>{item.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}
        {[
          {
            title: concept
              ? "Implementation Plan"
              : isWebsite
                ? "Build details"
                : "Implementation notes",
            items: concept ? project.implementationPlan : project.implementationNotes,
          },
          {
            title: content.outcomeTitle,
            items: content.outcome,
          },
        ].map(
          (section) =>
            !!section.items?.length && (
              <section className="case-text case-section" key={section.title}>
                <h2>{section.title}</h2>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ),
        )}
        {!!links.length && (
          <section className="case-section">
            <h2>EXPLORE THE PROJECT</h2>
            <div className="actions">
              {links.map((link) => (
                <a
                  key={link.url}
                  className="text-link"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="cta-label">{link.label}</span>
                </a>
              ))}
            </div>
          </section>
        )}
        {next && next.slug !== slug && (
          <nav className="case-next" aria-label="Project navigation">
            <Link href={`/work/${next.slug}#main`} aria-label={`Next project: ${next.title}`}>
              <span className="micro">NEXT PROJECT / {next.category}</span>
              <span className="case-next-title">{next.title}</span>
            </Link>
          </nav>
        )}
        <div className="work-contact">
          <Link href="/work" className="text-link">
            <span className="cta-label">All work</span>
          </Link>
          <Link href="/#contact" className="text-link">
            <span className="cta-label">Discuss a similar system</span>
          </Link>
        </div>
      </main>
    </PageMotion>
  );
}
