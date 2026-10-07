import { siteConfig } from "@/data/site";
import { pageMetadata } from "@/data/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageMotion } from "@/components/animations/PageMotion";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { SystemStory } from "@/components/sections/SystemStory";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WorkflowShowcase } from "@/components/sections/WorkflowShowcase";
import GlyphPortal from "@/components/ui/glyph-portal";
import { Websites } from "@/components/sections/Websites";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
export const metadata = pageMetadata(
  `${siteConfig.name} — GoHighLevel Automation Specialist & CRM Systems Builder`,
  siteConfig.description,
  "/",
);
export default function Home() {
  return (
    <main id="main">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${siteConfig.url}/#person`,
            name: siteConfig.name,
            jobTitle: "GoHighLevel Systems Builder",
            url: siteConfig.url,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Butuan City",
              addressCountry: "PH",
            },
            sameAs: Object.values(siteConfig.socials).filter(Boolean),
            knowsAbout: ["GoHighLevel", "CRM setup", "Workflow automation", "Make.com", "Webhooks"],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${siteConfig.url}/#website`,
            name: siteConfig.name,
            url: siteConfig.url,
          },
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: siteConfig.url,
            mainEntity: { "@id": `${siteConfig.url}/#person` },
          },
        ]}
      />
      <PageMotion>
        <Hero />
        <GlyphPortal>
          <Services />
        </GlyphPortal>
        <SystemStory />
        <SelectedWork />
        <WorkflowShowcase />
        <Websites />
        <Process />
        <About />
        <FAQ />
        <Contact />
      </PageMotion>
    </main>
  );
}
