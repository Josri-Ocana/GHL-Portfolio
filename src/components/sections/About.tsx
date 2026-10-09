import { Tools } from "@/components/sections/Tools";
import { homepageCopy } from "@/data/homepage";
import { SectionLabel } from "@/components/ui/SectionLabel";
export function About() {
  return (
    <>
      <Tools />
      <section id="about" className="about-section section inverted">
        <div className="wrap">
          <SectionLabel number="08">THE PERSON BEHIND THE SYSTEM</SectionLabel>
          <div className="about-layout">
            <h2 aria-label="I’m Josri. I connect the dots.">
              <span className="type-mask">
                <span data-type-line>I’M JOSRI.</span>
              </span>
              <span className="type-mask">
                <span data-type-line>I CONNECT</span>
              </span>
              <span className="type-mask">
                <span data-type-line className="outline-word">
                  {Array.from("THE DOTS.").map((letter, i) => (
                    <span data-letter key={i} aria-hidden="true">
                      {letter === " " ? "\u00a0" : letter}
                    </span>
                  ))}
                </span>
              </span>
            </h2>
            <div>
              <p className="lead">
                {homepageCopy.about.role}
                <br />
                {homepageCopy.about.location}
              </p>
              {homepageCopy.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <span className="micro about-signoff">
                {homepageCopy.about.education.title}
                <br />
                {homepageCopy.about.education.institution}
                <br />
                {homepageCopy.about.education.years}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
