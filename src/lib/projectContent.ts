import type { Project } from "@/types/project";

/** Demo prose already repeats the summary; retain unique context for real work. */
export function caseContent(project: Project) {
  const challenge = [
    ...new Set(
      [
        project.challenge || project.problem,
        !project.isDemo && project.description !== project.summary
          ? project.description
          : undefined,
        project.objective,
      ].filter((text): text is string => Boolean(text)),
    ),
  ];
  return {
    challenge,
    outcomeTitle: project.isDemo
      ? "What this demo demonstrates"
      : project.results?.length
        ? "Outcome"
        : "What I delivered",
    outcome: project.isDemo
      ? project.demonstrates
      : project.results?.length
        ? project.results
        : project.deliverables,
  };
}
