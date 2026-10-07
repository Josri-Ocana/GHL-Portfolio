import { siteOrigin } from "@/lib/siteOrigin";
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Josri Ocaña",
  title: "GoHighLevel Automation Specialist & CRM Systems Builder",
  description:
    "Josri Ocaña builds GoHighLevel CRM systems, workflow automation, funnels, and integrations for service businesses and agencies.",
  location: "Butuan City, Philippines",
  url: siteOrigin(configuredUrl),
  isConfigured: Boolean(configuredUrl),
  // Intentionally unconfigured: existing materials contain conflicting addresses.
  email: "",
  socials: { linkedin: "", github: "" },
  hero: {
    headline: ["GOOD LEADS.", "BETTER SYSTEMS."],
    revealHeadline: ["LESS CHAOS.", "MORE CONTROL."],
    introduction: "GoHighLevel Automation Specialist building CRM systems that move leads forward.",
    supporting:
      "CRM automation, funnels, websites, and integrations for agencies and service businesses—from lead capture to follow-up.",
  },
  contact: {
    headline: "LET’S BUILD A SYSTEM THAT WORKS.",
    description:
      "Have a workflow to untangle, a funnel to build, or a CRM that needs a clearer structure? Let’s start there.",
    unconfigured:
      "Direct contact details are being updated. Please use the channel where you found this portfolio to get in touch.",
  },
} as const;
