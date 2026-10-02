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
export function generateStaticParams() {
  return publishedProjects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return {
    ...pageMetadata(
      project.seo?.title || `${project.isDemo ? "Demo — " : ""}${project.title}`,
      project.seo?.description || project.description || project.summary,
      `/work/${project.slug}`,
    ),
    ...(project.isDemo ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const content = caseContent(project);
  const isWebsite = ["Websites", "Funnels"].includes(project.category);
  const next =
    publishedProjects[
      (publishedProjects.findIndex((item) => item.slug === slug) + 1) % publishedProjects.length
    ];
  const links = [
    { label: "Visit live site", url: project.liveUrl },
    { label: "View repository", url: project.repositoryUrl },
    ...(project.resources || []),
  ].filter((link) => safeExternalUrl(link.url));
  return (
    <PageMotion>
      <main id="main" className="wrap case-page">
        {!project.isDemo && (
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
            {project.isDemo && "DEMO PROJECT / "}
            {project.category} {project.year && `/ ${project.year}`}
          </p>
          <h1>{project.title}</h1>
          <p className="lead">{project.summary}</p>
          <dl className="case-facts">
            {project.role && (
              <div>
                <dt>ROLE</dt>
                <dd>{project.role}</dd>
              </div>
            )}
            <div>
              <dt>TOOLS</dt>
              <dd>{project.tools.join(" / ")}</dd>
            </div>
            {project.status && (
              <div>
                <dt>STATUS</dt>
                <dd>{project.status}</dd>
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
              <h2>Challenge</h2>
              <div>
                {content.challenge.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </section>
          )}
          {project.solution && (
            <section className="case-text" data-reveal>
              <h2>Solution</h2>
              <p>{project.solution}</p>
            </section>
          )}
        </div>
        {(project.coverImage || (isWebsite && project.demoVisual)) && (
          <section className="case-section">
            <h2>{isWebsite ? "DESKTOP PREVIEW" : "PROJECT PREVIEW"}</h2>
            {project.coverImage ? (
              <Image
                className="case-cover"
                src={project.coverImage}
                alt={project.coverAlt || project.title}
                width={1600}
                height={1000}
                sizes="(max-width: 900px) 100vw, 85vw"
              />
            ) : (
              <DemoVisual project={project} />
            )}
          </section>
        )}
        {project.mobileImage && (
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
        {!!project.workflowSteps?.length && !isWebsite && <CaseArchitecture project={project} />}
        {!!project.workflowSteps?.length && isWebsite && (
          <section className="case-section">
            <h2>{isWebsite ? "PAGE TO CRM" : "WORKFLOW & ARCHITECTURE"}</h2>
            <ol className="case-workflow">
              {project.workflowSteps.map((step, i) => (
                <li key={`${step.title}-${i}`}>
                  <span className="micro">{String(i + 1).padStart(2, "0")} →</span>
                  <h3>{step.title}</h3>
                  {step.description && <p>{step.description}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}
        {(project.video || (project.isDemo && project.demoVideoSlot)) && (
          <section className="case-section">
            <h2>VIDEO WALKTHROUGH</h2>
            <ProjectWalkthrough project={project} />
          </section>
        )}
        {!!project.gallery?.length && (
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
            title: isWebsite ? "Build details" : "Implementation notes",
            items: project.implementationNotes,
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
