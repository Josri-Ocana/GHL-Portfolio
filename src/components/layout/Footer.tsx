import Link from "next/link";
import { siteConfig } from "@/data/site";
import { safeExternalUrl } from "@/lib/media";
export function Footer() {
  return (
    <footer className="site-footer wrap">
      <div>
        <Link href="/" className="wordmark">
          JOSRI OCAÑA
        </Link>
        <p>
          GoHighLevel Systems Builder
          <br />
          {siteConfig.location}
        </p>
      </div>
      <div className="footer-links">
        {siteConfig.email && (
          <a className="text-link" href={`mailto:${siteConfig.email}`}>
            <span className="cta-label">Email</span>
          </a>
        )}
        {Object.entries(siteConfig.socials).map(([name, url]) =>
          safeExternalUrl(url) ? (
            <a
              className="text-link"
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="cta-label">{name === "github" ? "GitHub" : "LinkedIn"}</span>
            </a>
          ) : null,
        )}
        <a className="text-link" href="#top">
          <span className="cta-label">Back to top</span>
        </a>
      </div>
      <p className="footer-bottom">
        © {new Date().getFullYear()} {siteConfig.name}
        <span>BUILT WITH INTENTION.</span>
      </p>
    </footer>
  );
}
