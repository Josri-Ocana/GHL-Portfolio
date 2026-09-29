import test from "node:test";
import assert from "node:assert/strict";
import { projects, publishedProjects, getProject } from "../src/data/projects";
import { videoEmbedUrl, safeExternalUrl } from "../src/lib/media";
import { projectCategories } from "../src/types/project";

test("draft projects cannot be resolved by public slug", () => {
  for (const project of projects.filter((item) => !item.published)) {
    assert.equal(getProject(project.slug), undefined);
    assert.equal(publishedProjects.includes(project), false);
  }
});
test("project slugs are unique and safe, with publishable content", () => {
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(projectCategories.includes(project.category));
    if (project.published) {
      assert.ok(project.title.trim() && project.summary.trim() && project.tools.length);
      for (const image of project.gallery || []) assert.ok(image.alt.trim());
      for (const url of [
        project.liveUrl,
        project.repositoryUrl,
        ...(project.resources?.map((resource) => resource.url) || []),
      ]) {
        if (url) assert.ok(safeExternalUrl(url));
      }
    }
  }
});
test("media URL normalization accepts supported providers", () => {
  assert.equal(
    videoEmbedUrl({ provider: "loom", url: "https://www.loom.com/share/abc123", title: "Demo" }),
    "https://www.loom.com/embed/abc123",
  );
  for (const url of [
    "https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/shorts/dQw4w9WgXcQ",
  ]) {
    assert.equal(
      videoEmbedUrl({ provider: "youtube", url, title: "Demo" }),
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  }
  assert.equal(
    videoEmbedUrl({ provider: "vimeo", url: "https://vimeo.com/123456/abc123", title: "Demo" }),
    "https://player.vimeo.com/video/123456?h=abc123",
  );
});
test("media URLs reject executable and unrelated hosts", () => {
  assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
  assert.equal(
    videoEmbedUrl({
      provider: "youtube",
      url: "https://youtube.com.attacker.test/watch?v=dQw4w9WgXcQ",
      title: "Demo",
    }),
    undefined,
  );
  assert.equal(
    videoEmbedUrl({ provider: "loom", url: "https://loom.com/share/<script>", title: "Demo" }),
    undefined,
  );
});

test("demo library is visibly identifiable and excluded from indexing", async () => {
  const { indexableProjects } = await import("../src/data/projects");
  const demos = publishedProjects.filter((project) => project.isDemo);
  assert.equal(demos.length, 9);
  assert.equal(demos.filter((project) => project.featured).length, 3);
  assert.equal(
    demos.filter((project) => ["Websites", "Funnels"].includes(project.category)).length,
    4,
  );
  for (const project of demos) {
    assert.ok(!indexableProjects.includes(project));
    assert.equal(getProject(project.slug), project);
    assert.ok(
      project.demoVisual && project.workflowSteps?.length && project.implementationNotes?.length,
    );
    assert.ok(project.description?.includes("not client work"));
    assert.equal(project.clientName, undefined);
    assert.equal(project.year, undefined);
    assert.equal(project.liveUrl, undefined);
    assert.equal(project.repositoryUrl, undefined);
    assert.equal(project.video, undefined);
    assert.equal(project.results?.length, 0);
  }
});
import { caseContent } from "../src/lib/projectContent";

test("case-study outcomes distinguish demos, measured results and deliverables", () => {
  const base = publishedProjects[0];
  assert.equal(
    caseContent({ ...base, results: ["Must not be used"] }).outcomeTitle,
    "What this demo demonstrates",
  );
  assert.deepEqual(
    caseContent({ ...base, results: ["Must not be used"] }).outcome,
    base.demonstrates,
  );
  assert.equal(
    caseContent({ ...base, isDemo: false, results: ["Verified outcome"] }).outcomeTitle,
    "Outcome",
  );
  assert.deepEqual(
    caseContent({ ...base, isDemo: false, results: [], deliverables: ["CRM handoff"] }).outcome,
    ["CRM handoff"],
  );
  assert.equal(
    caseContent({ ...base, isDemo: false, results: [] }).outcomeTitle,
    "What I delivered",
  );
});
test("challenge merges unique context without repeating demo overview", () => {
  const demo = publishedProjects[0];
  assert.deepEqual(caseContent(demo).challenge, [demo.problem, demo.objective]);
  assert.deepEqual(
    caseContent({
      ...demo,
      challenge: "Specific challenge",
      problem: "Legacy problem",
      objective: undefined,
    }).challenge,
    ["Specific challenge"],
  );
});
import { technicalWorkflow } from "../src/data/workflow";

test("technical workflow branches resolve to known states and bypass reminders for bookings", () => {
  const keys = technicalWorkflow.map((step) => step.key);
  assert.equal(new Set(keys).size, keys.length);
  assert.equal(keys.length, 7);
  for (const step of technicalWorkflow) {
    assert.ok(step.title && step.description);
    for (const branch of step.branches || []) assert.ok(keys.includes(branch.target));
  }
  const decision = technicalWorkflow.find((step) => step.key === "decision")!;
  assert.equal(decision.branches?.find((branch) => branch.label === "YES")?.target, "complete");
  assert.equal(decision.branches?.find((branch) => branch.label === "NO")?.target, "follow-up");
  assert.equal(technicalWorkflow.find((step) => step.key === "follow-up")?.route, "NO BRANCH ONLY");
});
