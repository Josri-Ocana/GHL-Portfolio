import gsap from "gsap";
import { sectionTransitions } from "./sectionTransitions";
import { serviceMotion } from "./serviceMotion";
import { processMotion } from "./processMotion";
import { motion, type MotionConditions } from "@/lib/motion";

export function editorialTimeline(root: HTMLElement, { desktop, tablet }: MotionConditions) {
  const select = gsap.utils.selector(root);
  const hero = root.querySelector<HTMLElement>(".hero");
  if (hero) {
    const heading = hero.querySelector<HTMLElement>("[data-magnetic-heading]");
    if (heading) delete heading.dataset.heroReady;
    const entrance = gsap
      .timeline({
        defaults: { ease: motion.ease, clearProps: "all" },
        onComplete: () => {
          if (heading) heading.dataset.heroReady = "true";
        },
      })
      .from(select(".hero-eyebrow"), { y: 12, opacity: 0, duration: 0.5 });
    if (desktop || tablet) {
      // Whole-line opposing shutters replace the hero's vertical/rotation reveal.
      // One timeline owns the slices and base text, then hands off to MagneticText.
      hero.querySelectorAll<HTMLElement>(".hero-shutter-line").forEach((line, index) => {
        const base = line.querySelector("[data-hero-line]");
        const slices = line.querySelectorAll(".hero-shutter-slice");
        entrance
          .set(base, { opacity: 0, clearProps: "" }, 0)
          .fromTo(
            slices,
            {
              xPercent: (slice: number) => (slice === 1 ? 12 : -12),
              opacity: 0,
            },
            {
              xPercent: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.06,
              clearProps: "transform",
            },
            0.14 + index * 0.17,
          )
          .to(base, { opacity: 1, duration: 0.14 }, 1.01 + index * 0.17)
          .to(slices, { opacity: 0, duration: 0.14 }, 1.01 + index * 0.17);
      });
    } else {
      entrance
        .from(
          select("[data-hero-line]"),
          { yPercent: 112, rotation: 3, duration: 1.15, stagger: 0.23 },
          0.18,
        )
        .from(select("[data-hero-word]:last-child"), { rotation: -4, duration: 0.9 }, 0.4);
    }
    entrance.from(select(".hero-bottom"), { y: 22, opacity: 0, duration: 0.75 }, 0.8);
    const divider = hero.querySelector(".hero-footnote");
    gsap.from(divider, {
      "--divider-scale": 0,
      duration: 1,
      scrollTrigger: { trigger: divider, start: "top 95%", toggleActions: "play none none none" },
    });
  }
  select("[data-reveal]:not(#services .section-heading):not(#work .section-heading)").forEach(
    (element: HTMLElement) =>
      gsap.from(element, {
        y: 28,
        opacity: 0,
        duration: motion.reveal,
        ease: motion.ease,
        clearProps: "all",
        scrollTrigger: { trigger: element, start: "top 92%", toggleActions: "play none none none" },
      }),
  );
  select(".service-row").forEach((row: HTMLElement) => {
    serviceMotion(row, !(desktop || tablet));
  });
  const cleanupProcess = processMotion(root);
  const contact = root.querySelector(".contact-section h2");
  if (contact)
    gsap.from(contact.querySelectorAll("[data-cta-word]"), {
      yPercent: (i) => (i >= 4 ? 145 : 110),
      rotation: (i) => (i % 2 ? 3 : -3),
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: motion.ease,
      clearProps: "all",
      scrollTrigger: { trigger: contact, start: "top 88%", toggleActions: "play none none none" },
    });
  const contactBottom = root.querySelector(".contact-bottom");
  if (contactBottom)
    gsap.from(contactBottom, {
      y: 18,
      opacity: 0,
      duration: 0.8,
      clearProps: "all",
      scrollTrigger: {
        trigger: contactBottom,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  sectionTransitions(root, { desktop, tablet, allowed: true });
  return cleanupProcess;
}
