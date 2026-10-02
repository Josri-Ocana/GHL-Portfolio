import type { Project, WorkflowSymbol } from "../types/project";
export type TimelineMilestone = {
  id: string;
  index: number;
  step: string;
  title: string;
  label?: string;
  description?: string;
  icon: WorkflowSymbol;
  position: "top" | "bottom";
};
export function projectTimeline(project: Project): TimelineMilestone[] {
  const milestones = (project.workflowSteps || []).map(
    (step, index) =>
      ({
        id: step.id || `${project.slug}-step-${index + 1}`,
        index,
        step: String(index + 1).padStart(2, "0"),
        title: step.title,
        label: step.label,
        description: step.description,
        icon: step.icon || "workflow",
        position: step.position || (index % 2 === 0 ? "top" : "bottom"),
      }) satisfies TimelineMilestone,
  );
  if (new Set(milestones.map((item) => item.id)).size !== milestones.length)
    throw new Error(`Duplicate workflow step IDs: ${project.slug}`);
  return milestones;
}
