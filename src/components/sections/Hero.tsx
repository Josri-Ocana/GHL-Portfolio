import Link from "next/link";
import { siteConfig } from "@/data/site";
import { MagneticText } from "@/components/ui/morphing-cursor";
export function Hero() {
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-eyebrow" data-hero-meta>
        <span>
          <i className="status-dot" /> INDEPENDENT SYSTEMS BUILDER
        </span>
        <span>BUTUAN, PHILIPPINES · WORKING REMOTELY</span>
      </div>
      <MagneticText hoverLines={siteConfig.hero.revealHeadline}>
        <h1 id="hero-title" className="hero-title" data-magnetic-heading>
          {siteConfig.hero.headline.map((line, index) => (
            <span className="line-mask" key={line}>
              <span data-hero-line className={index ? "outline-word" : ""}>
                {line.split(" ").map((word, wordIndex) => (
                  <span key={word}>
                    {wordIndex > 0 && " "}
                    <span data-hero-word>{word}</span>
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
      </MagneticText>
      <div className="hero-bottom" data-hero-meta>
        <div className="hero-index">
          <span className="crosshair">✳</span>
          <span>
            STRUCTURE.
            <br />
            CONNECT.
            <br />
            MOVE FORWARD.
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
