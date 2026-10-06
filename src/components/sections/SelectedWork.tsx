import Link from "next/link";
import { featuredWork } from "@/data/featuredWork";
import { WorksWheel } from "@/components/ui/works-wheel";
import { DemoVisual } from "@/components/work/DemoVisual";
import { EmptyWork } from "@/components/work/EmptyWork";
import { SectionLabel } from "@/components/ui/SectionLabel";
export function SelectedWork() {
  const visible = featuredWork;
  const header = (
    <>
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
    </>
  );
  return visible.length ? (
    <WorksWheel
      id="work"
      className="section wrap"
      header={header}
      label="SELECTED WORK"
      action="VIEW CASE STUDY"
      items={visible.map((project) => ({
        title: project.title,
        image: project.coverImage || project.video?.poster,
        alt: project.coverAlt || `${project.title} concept preview`,
        href: `/work/${project.slug}`,
        preview: project.demoVisual ? (
          <DemoVisual project={project} />
        ) : (
          <div className="project-cover-type">
            <span>{project.title}</span>
          </div>
        ),
      }))}
    />
  ) : (
    <section id="work" className="section wrap">
      {header}
      <EmptyWork />
    </section>
  );
}
