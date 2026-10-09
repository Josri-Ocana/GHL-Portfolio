export type ServiceVisual = "pipeline" | "workflow" | "website" | "integration";

type Service = {
  title: string;
  description: string;
  details: string;
  visual: ServiceVisual;
};

export const services: readonly Service[] = [
  {
    title: "CRM setup & pipelines",
    visual: "pipeline",
    description:
      "GoHighLevel CRM setup, custom fields, tags, and opportunity pipelines that give every lead a place and a next step.",
    details: "CRM SETUP / PIPELINES / LEAD TRACKING",
  },
  {
    title: "Workflow automation",
    visual: "workflow",
    description:
      "GoHighLevel workflow automation for lead routing, email and SMS follow-up, calendars, appointment flows, and internal notifications.",
    details: "WORKFLOWS / FOLLOW-UP / CALENDARS",
  },
  {
    title: "Websites & funnels",
    visual: "website",
    description:
      "GoHighLevel websites, funnels, forms, surveys, and WordPress landing pages built around a clear customer journey.",
    details: "LANDING PAGES / FORMS / FUNNELS",
  },
  {
    title: "APIs & integrations",
    visual: "integration",
    description:
      "Make.com scenarios, REST APIs, and webhooks that map and move data between the tools your business already uses.",
    details: "MAKE.COM / API / WEBHOOKS",
  },
];
export const processSteps = [
  {
    title: "Understand",
    text: "Map the lead journey, current tools, and the points where work gets stuck.",
  },
  {
    title: "Architect",
    text: "Define the pipeline, data structure, triggers, and handoffs before building.",
  },
  {
    title: "Build",
    text: "Create the pages, forms, CRM structure, and workflows around that plan.",
  },
  {
    title: "Integrate",
    text: "Connect tools and check that each field arrives in the right place.",
  },
  {
    title: "Test",
    text: "Run realistic paths, edge cases, and failure checks from capture to follow-up.",
  },
  {
    title: "Refine",
    text: "Resolve friction, document the setup, and make ongoing maintenance easier.",
  },
];
