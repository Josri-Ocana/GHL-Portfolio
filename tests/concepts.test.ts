import test from "node:test";
import assert from "node:assert/strict";
import { conceptProjects } from "../src/data/conceptProjects";
import { demoProjects } from "../src/data/demoProjects";
import { getProject, indexableProjects, publishedProjects } from "../src/data/projects";
import { featuredWork } from "../src/data/featuredWork";
import { caseContent } from "../src/lib/projectContent";
import { archiveCategory, projectStatusLabel, workCategories } from "../src/lib/projectStatus";
import type { Project } from "../src/types/project";

test("public concepts disclose planning without fabricated proof or homepage inclusion", () => {
  assert.equal(demoProjects.length, 9);
  assert.equal(conceptProjects.length, 26);
  assert.equal(publishedProjects.length, 35);
  assert.equal(featuredWork.length, 7);
  for (const concept of conceptProjects) {
    const project: Project = concept;
    assert.equal(getProject(project.slug), project);
    assert.equal(project.status, "concept");
    assert.equal(projectStatusLabel(project), "CONCEPT");
    assert.ok(project.headline && project.problem && project.solution);
    assert.ok(project.implementationPlan?.length && project.whatThisConceptDemonstrates?.length);
    assert.match(project.description!, /not implemented, tested, recorded or delivered/);
    assert.ok(!indexableProjects.includes(project));
    assert.ok(!featuredWork.includes(project));
    for (const field of [
      "clientName",
      "coverImage",
      "video",
      "gallery",
      "results",
      "liveUrl",
      "repositoryUrl",
    ] as const) {
      assert.equal(project[field], undefined);
    }
  }
});

test("archive categories partition every project once and retain legacy filter meanings", () => {
  const counts = workCategories.map(
    (category) => publishedProjects.filter((p) => archiveCategory(p) === category).length,
  );
  assert.equal(
    counts.reduce((sum, count) => sum + count, 0),
    publishedProjects.length,
  );
  assert.equal(archiveCategory({ ...demoProjects[0], category: "Funnels" }), "Websites");
  assert.equal(archiveCategory({ ...demoProjects[0], category: "Workflow" }), "Automation");
});

test("concept outcome ignores proof until status is explicitly upgraded", () => {
  const project: Project = {
    ...conceptProjects[0],
    results: ["Verified test result"],
    deliverables: ["Configured workflow"],
  };
  assert.equal(caseContent(project).outcomeTitle, "What this concept demonstrates");
  assert.deepEqual(caseContent(project).outcome, project.whatThisConceptDemonstrates);
  assert.equal(caseContent({ ...project, status: "built-demo" }).outcomeTitle, "Outcome");
  assert.deepEqual(caseContent({ ...project, status: "built-demo" }).outcome, project.results);
  assert.deepEqual(
    caseContent({ ...project, status: "built-demo", results: [] }).outcome,
    project.deliverables,
  );
  assert.equal(projectStatusLabel({ ...project, status: "client-project" }), "CLIENT PROJECT");
});
