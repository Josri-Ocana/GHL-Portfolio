import type { Project } from "@/types/project";
import { demoProjects } from "./demoProjects";
import { conceptProjects } from "./conceptProjects";

// Copy this entry, replace all template content, and publish only with permission.
// Drafts never appear in routes, filters, metadata, structured data, or the sitemap.
export const projects: Project[] = [
  ...demoProjects,
  ...conceptProjects,
  {
    slug: "project-template",
    title: "Unpublished project template",
    summary: "Replace with a factual, one-sentence description of the completed work.",
    description: "Describe the actual scope, context, and responsibilities.",
    category: "Automation",
    tags: [],
    tools: ["GoHighLevel"],
    role: "Replace with actual role",
    featured: false,
    published: false,
    problem: "Describe the supplied problem.",
    solution: "Explain what was implemented.",
    workflowSteps: [
      { title: "Capture", description: "Describe the real entry point." },
      { title: "Follow up", description: "Describe the actual next step." },
    ],
    gallery: [],
    results: [],
  },
];

export const publishedProjects = projects.filter((project) => project.published);
export const indexableProjects = publishedProjects.filter(
  (project) => !project.isDemo && project.status !== "concept" && project.status !== "built-demo",
);
export function getProject(slug: string) {
  return publishedProjects.find((project) => project.slug === slug);
}
