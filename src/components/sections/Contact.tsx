import { siteConfig } from "@/data/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
export function Contact() {
  return (
    <section id="contact" className="contact-section section wrap">
      <SectionLabel number="10">YOUR NEXT SYSTEM</SectionLabel>
      <h2>
        {siteConfig.contact.headline.split(" ").map((word, index) => (
          <span key={`${word}-${index}`}>
            {index > 0 && " "}
            <span className="word-mask">
              <span data-cta-word>{word}</span>
            </span>
          </span>
        ))}
      </h2>
      <div className="contact-bottom">
        <p>{siteConfig.contact.description}</p>
        {siteConfig.email ? (
          <a className="button button-dark" href={`mailto:${siteConfig.email}`}>
            <span className="cta-label">Let’s talk</span>
          </a>
        ) : (
          <p className="contact-note">{siteConfig.contact.unconfigured}</p>
        )}
      </div>
    </section>
  );
}
