import Link from "next/link";
import { siteConfig } from "@/data/site";
import { HeroTextReveal } from "@/components/ui/hero-text-reveal";
import { HeroShutterLine } from "@/components/ui/hero-shutter-line";
export function Hero() {
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-eyebrow" data-hero-meta>
        <span>
          <i className="status-dot" /> INDEPENDENT SYSTEMS BUILDER
        </span>
        <span>BUTUAN, PHILIPPINES · WORKING REMOTELY</span>
      </div>
      <HeroTextReveal lines={siteConfig.hero.revealHeadline}>
        <h1 id="hero-title" className="hero-title" data-magnetic-heading>
          {siteConfig.hero.headline.map((line, index) => (
            <HeroShutterLine text={line} outlined={Boolean(index)} key={line} />
          ))}
        </h1>
      </HeroTextReveal>
      <div className="hero-bottom" data-hero-meta>
        <div className="hero-index">
          <span className="crosshair" aria-hidden="true">
            ✳
          </span>
          <span>
            <span className="hero-identity-name">{siteConfig.name}</span>
            <span className="hero-identity-role">{siteConfig.title}</span>
          </span>
        </div>
        <div className="hero-copy">
          <p className="lead">{siteConfig.hero.introduction}</p>
          <p className="muted">{siteConfig.hero.supporting}</p>
          <div className="actions">
            <Link href="/work" className="button button-dark">
              <span className="cta-label">View my work</span>
            </Link>
            <Link href="#contact" className="button">
              <span className="cta-label">Contact me</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-footnote">
        <span>CRM / AUTOMATION / INTEGRATION</span>
        <a href="#services">SCROLL TO EXPLORE</a>
      </div>
    </section>
  );
}
