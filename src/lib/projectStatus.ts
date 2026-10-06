import type { Project } from "../types/project";

export function projectStatusLabel(project: Project) {
  if (project.status === "concept") return "CONCEPT";
  if (project.status === "built-demo") return "BUILT DEMO";
  if (project.status === "client-project") return "CLIENT PROJECT";
  return project.isDemo ? "DEMO PROJECT" : project.year;
}

export const workCategories = [
  "Automation",
  "CRM",
  "AI",
  "Integrations",
  "Websites",
  "Operations",
  "Reporting",
] as const;

export function archiveCategory(project: Project) {
  if (project.category === "Funnels") return "Websites";
  if (project.category === "Workflow" || project.category === "GoHighLevel") return "Automation";
  return project.category;
}
