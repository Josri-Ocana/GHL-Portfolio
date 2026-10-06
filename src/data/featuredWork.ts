import { getProject } from "./projects";

/** Homepage discovery order; only existing published records can enter the wheel. */
export const featuredWorkSlugs = [
  "demo-lead-follow-up",
  "demo-crm-routing",
  "demo-client-onboarding",
  "demo-auto-shop-funnel",
  "demo-make-integration",
  "demo-appointment-booking",
  "demo-local-service",
] as const;

export const featuredWork = featuredWorkSlugs.flatMap((slug) => {
  const project = getProject(slug);
  return project ? [project] : [];
});
