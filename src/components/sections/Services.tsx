import { services } from "@/data/services";
import { homepageCopy } from "@/data/homepage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Arrow } from "@/components/ui/Arrow";
export function Services() {
  return (
    <section id="services" className="section wrap">
      <SectionLabel number="01">WHAT I BUILD</SectionLabel>
      <div className="section-heading" data-reveal>
        <h2>
          <span className="type-mask">
            <span data-boundary-line>LESS MANUAL.</span>
          </span>
          <span className="type-mask">
            <span data-boundary-line>MORE CONNECTED.</span>
          </span>
        </h2>
        <p>
          {homepageCopy.services.supporting[0]}
          <br />
          {homepageCopy.services.supporting[1]}
        </p>
      </div>
      <div className="service-list">
        {services.map((service, i) => (
          <article key={service.title} className="service-row">
            <span className="row-number">0{i + 1}</span>
            <div>
              <h3>{service.title}</h3>
              <p className="micro">{service.details}</p>
            </div>
            <p>{service.description}</p>
            <Arrow diagonal />
          </article>
        ))}
      </div>
    </section>
  );
}
