export const projectCategories = [
  "Automation",
  "GoHighLevel",
  "CRM",
  "Workflow",
  "Websites",
  "Funnels",
  "Integrations",
  "AI",
  "Operations",
  "Reporting",
] as const;
export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectStatus = "concept" | "built-demo" | "client-project";
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
  | "database"
  | "form"
  | "email"
  | "sms"
  | "calendar"
  | "condition";
export type WorkflowNodeType = "trigger" | "action" | "condition" | "data" | "output";
export type WorkflowNode = {
  id: string;
  title: string;
  description?: string;
  type?: WorkflowNodeType;
  icon?: WorkflowSymbol;
  /** Zero-based desktop grid coordinates; mobile always follows array order. */
  position?: { x: number; y: number };
};
export type WorkflowConnection = {
  from: string;
  to: string;
  label?: string;
  branch?: string;
};
export type WorkflowCanvasDefinition = {
  connections?: WorkflowConnection[];
} & (
  | { nodes: WorkflowNode[]; stepIds?: never }
  /** Omit nodes to reuse workflowSteps; select stepIds for a compact overview. */
  | { nodes?: never; stepIds?: string[] }
);
export type ProjectWorkflowVisualization =
  | ({ type: "canvas" } & WorkflowCanvasDefinition)
  | { type: "timeline"; overview?: WorkflowCanvasDefinition }
  | { type: "none" };
export type ProjectWorkflowStep = {
  id?: string;
  position?: "top" | "bottom";
  label?: string;
  title: string;
  description?: string;
  icon?: WorkflowSymbol;
  type?: WorkflowNodeType;
};
export type Project = {
  slug: string;
  title: string;
  headline?: string;
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
  /** Omitted only for the existing illustrative legacy records. */
  status?: ProjectStatus;
  implementationPlan?: string[];
  whatThisConceptDemonstrates?: string[];
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
  workflowVisualization?: ProjectWorkflowVisualization;
  results?: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  resources?: { label: string; url: string }[];
};
