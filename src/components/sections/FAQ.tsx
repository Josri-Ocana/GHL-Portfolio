import { faqs } from "@/data/faq";
import { SectionLabel } from "@/components/ui/SectionLabel";
export function FAQ() {
  return (
    <section id="faq" className="section wrap">
      <div className="faq-layout">
        <div>
          <SectionLabel number="09">A FEW ANSWERS</SectionLabel>
          <h2>
            GOOD
            <br />
            QUESTIONS.
          </h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
