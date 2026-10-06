import Link from "next/link";
import { publishedProjects } from "@/data/projects";
import { projectCategories } from "@/types/project";
import { archiveCategory, workCategories } from "@/lib/projectStatus";
import { pageMetadata } from "@/data/seo";
import { ProjectCard } from "@/components/work/ProjectCard";
import { EmptyWork } from "@/components/work/EmptyWork";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const valid = projectCategories.find((value) => value === category);
  return {
    ...pageMetadata(
      valid ? `${valid} projects` : "Work & case studies",
      valid
        ? `Explore ${valid.toLowerCase()} work and system breakdowns by Josri Ocaña.`
        : "Explore Josri Ocaña’s GoHighLevel systems, workflow automation, CRM, websites, funnels, and integration case studies.",
      "/work",
    ),
    ...(valid ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function Work({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const valid = projectCategories.find((value) => value === category);
  const active =
    valid === "Funnels"
      ? "Websites"
      : valid === "Workflow" || valid === "GoHighLevel"
        ? "Automation"
        : valid;
  const filtered = active
    ? publishedProjects.filter((project) => archiveCategory(project) === active)
    : publishedProjects;
  return (
    <main id="main" className="wrap work-page">
      <div className="page-intro">
        <p className="micro">THE PROJECT LIBRARY / JOSRI OCAÑA</p>
        <h1>
          WORK.
          <br />
          <span className="outline-word">WITH CONTEXT.</span>
        </h1>
        <div className="intro-bottom">
          <p>
            System architecture. How it connects.
            <br />
            The thinking behind the system.
          </p>
          <span className="micro">
            {String(publishedProjects.length).padStart(2, "0")} PROJECTS
          </span>
        </div>
      </div>
      {publishedProjects.some((project) => project.isDemo) && (
        <p className="demo-notice micro">
          DEMO PROJECTS ARE ILLUSTRATIVE CONCEPTS, NOT CLIENT WORK.
        </p>
      )}
      {publishedProjects.some((project) => project.status === "concept") && (
        <p className="demo-notice micro">
          CONCEPTS ARE PROPOSED SYSTEMS TO BUILD AND DEMONSTRATE — NOT IMPLEMENTED, TESTED OR
          CLIENT-DELIVERED WORK.
        </p>
      )}
      <nav className="filter-list" aria-label="Filter projects by category">
        {["All", ...workCategories].map((item) => (
          <Link
            key={item}
            href={item === "All" ? "/work" : `/work?category=${encodeURIComponent(item)}`}
            scroll={false}
            aria-current={(active || "All") === item ? "page" : undefined}
          >
            {item}
            <span>
              {item === "All"
                ? publishedProjects.length
                : publishedProjects.filter((project) => archiveCategory(project) === item).length}
            </span>
          </Link>
        ))}
      </nav>
      <div className="work-results" aria-label={active ? `${active} projects` : "All projects"}>
        {filtered.length ? (
          <div className="project-grid">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} headingLevel={2} subtle />
            ))}
          </div>
        ) : (
          <EmptyWork filtered={Boolean(active)} headingLevel={2} />
        )}
      </div>
      <div className="work-contact">
        <p>Have a system in mind?</p>
        <Link href="/#contact" className="text-link">
          <span className="cta-label">Let’s talk about it</span>
        </Link>
      </div>
    </main>
  );
}
