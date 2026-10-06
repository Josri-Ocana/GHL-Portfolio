import type { Project } from "@/types/project";

/** Demo prose already repeats the summary; retain unique context for real work. */
export function caseContent(project: Project) {
  if (project.status === "concept") {
    return {
      challenge: [project.challenge || project.problem].filter((text): text is string =>
        Boolean(text),
      ),
      outcomeTitle: "What this concept demonstrates",
      outcome: project.whatThisConceptDemonstrates,
    };
  }
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
    outcomeTitle:
      project.isDemo && !project.status
        ? "What this demo demonstrates"
        : project.results?.length
          ? "Outcome"
          : "What I delivered",
    outcome:
      project.isDemo && !project.status
        ? project.demonstrates
        : project.results?.length
          ? project.results
          : project.deliverables,
  };
}
