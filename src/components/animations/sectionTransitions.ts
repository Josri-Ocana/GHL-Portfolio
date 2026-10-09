import gsap from "gsap";
import { motion, type MotionConditions } from "@/lib/motion";

/** Boundary effects own outer masks; section timelines own their inner content. */
export function sectionTransitions(root: HTMLElement, { desktop, tablet }: MotionConditions) {
  const q = gsap.utils.selector(root);
  const strength = desktop
    ? motion.intensity.desktop
    : tablet
      ? motion.intensity.tablet
      : motion.intensity.mobile;
  const wide = desktop || tablet;
  const scrub = (trigger: Element, start = "top 95%", end = "top 30%") =>
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger, start, end, scrub: motion.scrub },
    });
  const services = root.querySelector("#services");
  const system = root.querySelector(".system-section");
  const work = root.querySelector("#work");
  const workflow = root.querySelector(".workflow-section");
  const websites = root.querySelector(".websites-section");
  const about = root.querySelector(".about-section");
  const faq = root.querySelector("#faq");
  const contact = root.querySelector("#contact");

  // The portal owns the services boundary on eligible desktop/tablet screens.
  if (services && !(services.closest(".glyph-portal") && wide)) {
    scrub(services)
      .from(services.querySelector(".section-heading"), {
        clipPath: "inset(0 0 100% 0)",
        y: 65 * strength,
        duration: 1,
      })
      .from(
        services.querySelectorAll("[data-boundary-line]"),
        { yPercent: 110, stagger: 0.15, duration: 0.7 },
        motion.overlap,
      );
    if (wide)
      scrub(services, "top bottom", "top 15%")
        .to(
          q(".hero-title > .line-mask:first-child"),
          { y: -150 * strength, x: -40 * strength, duration: 1 },
          0,
        )
        .to(
          q(".hero-title > .line-mask:last-child"),
          { y: -65 * strength, x: 100 * strength, scale: 1 + 0.045 * strength, duration: 1 },
          0,
        )
        .to(
          q(".hero-copy"),
          { y: -85 * strength, clipPath: "inset(0 0 100% 0)", opacity: 0.2, duration: 0.8 },
          motion.overlap,
        );
  }
  if (system) {
    scrub(system, "top 98%", "top 18%")
      .fromTo(
        system,
        { clipPath: `inset(${wide ? 24 : 8}% 0 0 0)` },
        { clipPath: "inset(0% 0 0 0)", duration: 1 },
      )
      .from(
        system.querySelector(".system-heading"),
        { y: 80 * strength, clipPath: "inset(0 0 100% 0)", duration: 0.8 },
        motion.overlap,
      );
    if (wide)
      scrub(system, "top bottom", "top 30%")
        .to(q(".service-row:nth-last-child(-n+2)"), {
          scaleY: 0.94,
          transformOrigin: "bottom",
          stagger: 0.12,
          duration: 1,
        })
        .to(q(".service-row:nth-last-child(-n+2) > p"), { opacity: 0.35, duration: 0.8 }, 0)
        .to(q(".service-row:nth-last-child(-n+2)"), { "--rule-reach": "5vw", duration: 0.8 }, 0);
  }
  if (work) {
    scrub(work, "top 105%", "top 28%")
      .fromTo(
        q(".system-to-work-canvas"),
        { clipPath: "inset(100% 42% 0 42%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
      )
      .to(q(".system-conclusion > span"), { x: 65 * strength, opacity: 0, duration: 0.6 }, 0)
      .from(
        work.querySelector(".section-heading"),
        { clipPath: "inset(0 100% 0 0)", x: -45 * strength, duration: 0.8 },
        1 - motion.overlap,
      );
  }
  if (workflow) {
    scrub(workflow)
      .fromTo(workflow, { "--boundary-scale": 0 }, { "--boundary-scale": 1, duration: 0.6 })
      .from(
        workflow.querySelector(".section-heading"),
        { clipPath: "inset(0 0 100% 0)", y: 65 * strength, duration: 0.8 },
        0.6 - motion.overlap,
      );
  }
  if (websites) {
    const frame = websites.querySelector(".browser-frame");
    if (wide)
      scrub(websites, "top bottom", "top 22%")
        .to(q(".workflow-diagram"), { scale: 1.035, clipPath: "inset(0 0 12% 0)", duration: 1 })
        .from(
          websites.querySelector(".section-heading"),
          { y: 85 * strength, clipPath: "inset(0 0 100% 0)", duration: 0.8 },
          motion.overlap,
        );
    if (frame) {
      scrub(frame, "top 98%", "top 22%")
        .from(frame, {
          scaleX: wide ? 0.8 : 0.95,
          scaleY: 0.95,
          clipPath: "inset(14% 0 8% 0)",
          y: 60 * strength,
          duration: 1,
        })
        .from(
          websites.querySelector(".browser-image, .browser-placeholder"),
          { y: 35 * strength, duration: 1 },
          0,
        );
      if (wide)
        scrub(websites, "bottom 75%", "bottom 10%").fromTo(
          frame,
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: "inset(0% 4% 12% 4%)", immediateRender: false, duration: 1 },
        );
    }
  }
  if (about) {
    scrub(about, "top 100%", "top 15%")
      .fromTo(
        about,
        { clipPath: `inset(${wide ? 28 : 10}% 0 0 0)` },
        { clipPath: "inset(0% 0 0 0)", duration: 1 },
      )
      .from(
        about.querySelectorAll("[data-type-line]"),
        { yPercent: 115, rotation: 2, stagger: 0.13, duration: 0.7 },
        motion.overlap,
      );
    if (wide) {
      scrub(about, "top 20%", "bottom 65%")
        .to(about.querySelectorAll("[data-letter]"), {
          y: (i) => ((i % 3) - 1) * 8 * strength,
          x: (i) => (i - 3) * 1.5 * strength,
          stagger: 0.015,
          duration: 0.5,
        })
        .to(about.querySelectorAll("[data-letter]"), { x: 0, y: 0, stagger: 0.015, duration: 0.5 });
    }
  }
  if (faq && about) {
    scrub(faq, "top 95%", "top 22%")
      .fromTo(
        about,
        { clipPath: "inset(0% 0 0% 0)" },
        { clipPath: `inset(0 0 ${wide ? 20 : 5}% 0)`, immediateRender: false, duration: 1 },
      )
      .to(about.querySelector("h2"), { y: -75 * strength, duration: 1 }, 0)
      .from(
        faq.querySelector("h2"),
        { clipPath: "inset(0 0 100% 0)", y: 65 * strength, duration: 0.8 },
        motion.overlap,
      );
  }
  if (contact) {
    scrub(contact, "top 98%", "top 45%").fromTo(
      contact,
      { "--boundary-scale": 0 },
      { "--boundary-scale": 1, duration: 1 },
    );
    if (wide)
      scrub(contact, "top bottom", "top 35%").to(q(".faq-list details"), {
        "--rule-reach": "3vw",
        stagger: 0.06,
        duration: 1,
      });
  }
}
