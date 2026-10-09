type SkillGroup = {
  title: string;
  purpose: string;
  featuredToolCount: number;
  tools: readonly string[];
};

export const toolkitCopy = {
  headline: ["RIGHT TOOL.", "CLEAR PURPOSE."],
  introduction: "A toolkit organized by the part each tool plays in a connected business system.",
} as const;

export const skillGroups = [
  {
    title: "CRM & automation",
    purpose: "Structure contacts, pipelines, and follow-up around the lead journey.",
    featuredToolCount: 2,
    tools: ["GoHighLevel", "Make.com"],
  },
  {
    title: "Websites & funnels",
    purpose: "Build the pages and forms that guide visitors toward an enquiry.",
    featuredToolCount: 2,
    tools: ["GoHighLevel", "WordPress", "Elementor", "Avada", "Pagelayer", "Beaver Builder"],
  },
  {
    title: "Integration & development",
    purpose: "Move information between tools and shape it into usable data.",
    featuredToolCount: 2,
    tools: [
      "REST APIs",
      "Webhooks",
      "JSON / Data mapping",
      "HTML / CSS",
      "JavaScript",
      "Git / GitHub",
    ],
  },
  {
    title: "AI & productivity",
    purpose: "Support research, documentation, collaboration, and everyday delivery.",
    featuredToolCount: 2,
    tools: ["ChatGPT", "Claude", "Lovable", "Google Sheets", "Google Docs", "Slack"],
  },
] as const satisfies readonly SkillGroup[];
