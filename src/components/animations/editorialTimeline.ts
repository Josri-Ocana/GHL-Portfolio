import gsap from "gsap";
import { sectionTransitions } from "./sectionTransitions";
import { motion, type MotionConditions } from "@/lib/motion";

export function editorialTimeline(root: HTMLElement, { desktop, tablet }: MotionConditions) {
  const select = gsap.utils.selector(root);
  const hero = root.querySelector<HTMLElement>(".hero");
  if (hero) {
    const heading = hero.querySelector<HTMLElement>("[data-magnetic-heading]");
    if (heading) delete heading.dataset.heroReady;
    gsap
      .timeline({
        defaults: { ease: motion.ease, clearProps: "all" },
        onComplete: () => {
          if (heading) heading.dataset.heroReady = "true";
        },
      })
      .from(select(".hero-eyebrow"), { y: 12, opacity: 0, duration: 0.5 })
      .from(
        select("[data-hero-line]"),
        { yPercent: 112, rotation: 3, duration: 1.15, stagger: 0.23 },
        0.18,
      )
      .from(select("[data-hero-word]:last-child"), { rotation: -4, duration: 0.9 }, 0.4)
      .from(select(".hero-bottom"), { y: 22, opacity: 0, duration: 0.75 }, 0.8);
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
    gsap
      .timeline({
        defaults: { ease: motion.ease },
        scrollTrigger: { trigger: row, start: "top 89%", toggleActions: "play none none none" },
      })
      .from(row, { "--divider-scale": 0, duration: 0.9 })
      .from(
        row.querySelectorAll("h3, .micro, .row-number"),
        {
          y: 22,
          opacity: 0,
          clipPath: "inset(0 0 100% 0)",
          duration: 0.65,
          stagger: 0.07,
          clearProps: "all",
        },
        0.1,
      )
      .from(
        row.querySelector(":scope > p"),
        { opacity: 0, y: 12, duration: 0.6, clearProps: "all" },
        0.25,
      );
  });
  select(".process-grid > li").forEach((step: HTMLElement, i: number) => {
    if (desktop || tablet) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 92%",
            end: "bottom 25%",
            scrub: motion.scrub,
          },
        })
        .from(step, {
          y: 55,
          scale: 0.97,
          clipPath: "inset(0 0 16% 0)",
          duration: 0.6,
          delay: (i % 3) * 0.13,
        })
        .from(step.querySelector(".process-number"), { y: -25, duration: 0.6 }, "<")
        .to(step, { scale: 0.985, y: -12, duration: 0.4 }, ">.35");
      return;
    }
    gsap
      .timeline({
        scrollTrigger: { trigger: step, start: "top 90%", toggleActions: "play none none none" },
      })
      .from(step, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        delay: (i % (desktop ? 3 : 2)) * 0.13,
        clearProps: "all",
      })
      .from(
        step.querySelector(".process-number"),
        { y: -18, opacity: 0, duration: 0.5, clearProps: "all" },
        "<.1",
      );
  });
  select(".skill-groups > div").forEach((group: HTMLElement) =>
    gsap.from(group, {
      "--divider-scale": 0,
      opacity: 0.4,
      duration: 0.8,
      scrollTrigger: { trigger: group, start: "top 92%", toggleActions: "play none none none" },
    }),
  );
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
}
