export const projectCategories = [
  "Automation",
  "GoHighLevel",
  "CRM",
  "Workflow",
  "Websites",
  "Funnels",
  "Integrations",
] as const;
export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectVideo = {
  provider: "loom" | "youtube" | "vimeo" | "file";
  url: string;
  poster?: string;
  title: string;
  captions?: string;
  transcript?: string;
};
export type WorkflowSymbol =
  | "workflow"
  | "trigger"
  | "webhook"
  | "json"
  | "mapping"
  | "integration"
  | "validation"
  | "database";
export type ProjectWorkflowStep = {
  id?: string;
  position?: "top" | "bottom";
  label?: string;
  title: string;
  description?: string;
  icon?: WorkflowSymbol;
};
export type Project = {
  slug: string;
  title: string;
  summary: string;
  description?: string;
  category: ProjectCategory;
  tags: string[];
  tools: string[];
  year?: string;
  role?: string;
  featured: boolean;
  published: boolean;
  isDemo?: boolean;
  number?: string;
  objective?: string;
  challenge?: string;
  deliverables?: string[];
  implementationNotes?: string[];
  demonstrates?: string[];
  demoVideoSlot?: boolean;
  demoVisual?: {
    kind: "flow" | "pipeline" | "website";
    headline: string;
    labels: string[];
    action?: string;
  };
  seo?: { title?: string; description?: string };
  status?: "Completed" | "In progress";
  clientName?: string;
  confidential?: boolean;
  coverImage?: string;
  coverAlt?: string;
  mobileImage?: string;
  gallery?: { src: string; alt: string; caption?: string }[];
  video?: ProjectVideo;
  problem?: string;
  solution?: string;
  workflowSteps?: ProjectWorkflowStep[];
  results?: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  resources?: { label: string; url: string }[];
};
