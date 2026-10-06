import test from "node:test";
import assert from "node:assert/strict";
import { publishedProjects } from "../src/data/projects";
import {
  projectCanvas,
  validateWorkflowGraph,
  workflowAncestors,
  workflowConnectionPath,
  positionedConnectionPath,
  scrollWorkflowCount,
  workflowNodeReveal,
  revealedNodeBounds,
} from "../src/lib/workflowCanvas";
import type { WorkflowConnection, WorkflowNode } from "../src/types/project";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WorkflowCanvas } from "../src/components/ui/WorkflowCanvas";

test("published canvas maps reuse approved workflow copy and featured cases keep timelines", () => {
  for (const project of publishedProjects) {
    const visualization = project.workflowVisualization;
    assert.ok(visualization);
    if (project.featured && !["Websites", "Funnels"].includes(project.category)) {
      assert.equal(visualization.type, "timeline");
    }
    const definition =
      visualization.type === "canvas"
        ? visualization
        : visualization.type === "timeline"
          ? visualization.overview
          : undefined;
    if (!definition) continue;
    const graph = projectCanvas(project, definition);
    assert.ok(graph.nodes.length);
    assert.ok(graph.nodes.every((node) => node.description && node.icon && node.type));
    for (const node of graph.nodes) {
      const step = project.workflowSteps!.find((step) => step.id === node.id)!;
      assert.equal(node.title, step.title);
      assert.equal(node.description, step.description);
    }
    assert.equal(graph.connections.length, graph.nodes.length - 1);
  }
  for (const project of publishedProjects.filter((project) =>
    ["Websites", "Funnels"].includes(project.category),
  )) {
    assert.equal(project.workflowVisualization?.type, "canvas");
    assert.equal(project.demoVisual?.kind, project.status === "concept" ? "flow" : "website");
  }
});

const branchNodes: WorkflowNode[] = [
  { id: "condition", title: "Decision", type: "condition", position: { x: 1, y: 0 } },
  { id: "yes", title: "Yes path", position: { x: 0, y: 1 } },
  { id: "no", title: "No path", position: { x: 2, y: 1 } },
  { id: "end", title: "Complete", position: { x: 1, y: 2 } },
];
const branchConnections: WorkflowConnection[] = [
  { from: "condition", to: "yes", branch: "yes", label: "Yes" },
  { from: "condition", to: "no", branch: "no", label: "No" },
  { from: "yes", to: "end" },
  { from: "no", to: "end" },
];

test("branch graphs retain distinct destinations and reject broken boundaries", () => {
  assert.doesNotThrow(() => validateWorkflowGraph(branchNodes, branchConnections));
  assert.throws(
    () => validateWorkflowGraph([...branchNodes, branchNodes[0]], branchConnections),
    /Duplicate/,
  );
  assert.throws(
    () => validateWorkflowGraph(branchNodes, [{ from: "condition", to: "missing" }]),
    /unknown node/,
  );
  assert.throws(
    () => validateWorkflowGraph(branchNodes, [{ from: "condition", to: "condition" }]),
    /Self-referencing/,
  );
  assert.throws(
    () => validateWorkflowGraph(branchNodes, [...branchConnections, branchConnections[0]]),
    /Duplicate/,
  );
  assert.throws(
    () => validateWorkflowGraph([{ id: "a", title: "A", position: { x: NaN, y: 0 } }], []),
    /positions/,
  );
  assert.throws(
    () =>
      validateWorkflowGraph(
        [
          { id: "a", title: "A", position: { x: 1, y: 0 } },
          { id: "b", title: "B" },
        ],
        [],
      ),
    /Overlapping/,
  );
  assert.throws(
    () => projectCanvas(publishedProjects[0], { stepIds: ["missing"] }),
    /Unknown workflow step/,
  );
});

test("connector endpoints meet card borders across horizontal, reverse, vertical and branch layouts", () => {
  const first = { x: 24, y: 0, width: 200, height: 160 };
  const next = { x: 280, y: 0, width: 200, height: 160 };
  assert.equal(workflowConnectionPath(first, next, 600).path, "M224,80 C252,80 252,80 280,80");
  assert.equal(workflowConnectionPath(next, first, 600).path, "M280,80 C252,80 252,80 224,80");
  assert.equal(
    workflowConnectionPath(first, { ...first, y: 208 }, 248).path,
    "M124,160 C124,184 124,184 124,208",
  );
  const branch = workflowConnectionPath(first, { ...next, y: 240 }, 600).path;
  assert.ok(branch.startsWith("M124,160") && branch.endsWith("380,240"));
  const skippedMobile = workflowConnectionPath(first, { ...first, y: 416 }, 248).path;
  assert.ok(skippedMobile.includes("L236,") && skippedMobile.endsWith("124,416"));
});

test("reading-path emphasis terminates on cycles without marking the current step completed", () => {
  const cycle = [
    { from: "a", to: "b" },
    { from: "b", to: "a" },
  ];
  assert.deepEqual([...workflowAncestors("a", cycle)], ["b"]);
  assert.deepEqual([...workflowAncestors("yes", branchConnections)], ["condition"]);
  assert.equal(workflowAncestors(null, cycle).size, 0);
});

test("server-rendered branching canvas exposes both paths without JavaScript or editor controls", () => {
  const html = renderToStaticMarkup(
    createElement(WorkflowCanvas, {
      nodes: branchNodes,
      connections: branchConnections,
      label: "Branching workflow",
    }),
  );
  assert.ok(html.includes('aria-label="Branching workflow"'));
  assert.equal((html.match(/role="listitem"/g) || []).length, 4);
  assert.equal((html.match(/class="workflow-canvas-branch"/g) || []).length, 2);
  assert.ok(html.includes("Yes path") && html.includes("No path"));
  assert.ok(html.includes("End of this workflow path."));
  assert.ok(!html.includes("<button") && !html.includes("draggable="));
});

test("Page to CRM scroll mode retains accessible remaining copy without editor buttons", () => {
  const project = publishedProjects.find((project) => project.slug === "demo-auto-shop-funnel")!;
  const graph = projectCanvas(project, {});
  const html = renderToStaticMarkup(
    createElement(WorkflowCanvas, {
      ...graph,
      interaction: "drag-nodes",
      label: "Page to CRM",
    }),
  );
  assert.ok(html.includes('class="workflow-canvas-viewport"') && html.includes('role="region"'));
  assert.equal((html.match(/tabindex="0"/g) || []).length, 2);
  assert.ok(html.includes("left:50px;top:80px") && !html.includes("left:1600px;top:80px"));
  assert.ok(html.includes("DRAG NODES / SCROLL TO REVEAL"));
  assert.ok(html.includes("Remaining workflow steps") && !html.includes("<button"));
  assert.ok(html.includes("--node-reveal:1"));
  for (const node of graph.nodes) assert.ok(html.includes(node.title));
  assert.ok(!html.includes("Workflow Builder"));
});

test("scroll progression reveals and retracts steps without exceeding the supplied sequence", () => {
  assert.equal(scrollWorkflowCount(6, 4, 0, 310), 4);
  assert.equal(scrollWorkflowCount(6, 4, 1, 310), 5);
  assert.equal(scrollWorkflowCount(6, 4, 311, 310), 6);
  assert.equal(scrollWorkflowCount(6, 4, 310, 310), 5);
  assert.equal(scrollWorkflowCount(6, 4, -5, 310), 4);
  assert.equal(scrollWorkflowCount(6, 1, 1550, 310), 6);
  assert.equal(scrollWorkflowCount(6, 1, 0, 310), 1);
  assert.equal(scrollWorkflowCount(6, 6, 10000, 310), 6);
});

test("node motion reverses with scroll and settles early with attached connector bounds", () => {
  assert.equal(workflowNodeReveal(3, 4, 0, 310), 1);
  assert.equal(workflowNodeReveal(4, 4, 0, 310), 0);
  assert.equal(workflowNodeReveal(4, 4, 90, 310), 0.875);
  assert.equal(workflowNodeReveal(4, 4, 180, 310), 1);
  assert.equal(workflowNodeReveal(5, 4, 310, 310), 0);
  assert.equal(workflowNodeReveal(5, 4, 490, 310), 1);
  assert.equal(workflowNodeReveal(5, 4, 400, 310), 0.875);
  const card = { x: 360, y: 80, width: 260, height: 196 };
  assert.deepEqual(revealedNodeBounds(card, 1), card);
  const revealing = revealedNodeBounds(card, 0.5);
  assert.equal(revealing.x, 380);
  assert.equal(revealing.width, 252.2);
  const path = positionedConnectionPath(card, revealing).path;
  assert.ok(path.endsWith(`${revealing.x},${revealing.y + revealing.height / 2}`));
});

test("dragging keeps supplied-component connections attached to the side of moved cards", () => {
  const moved = { x: 105, y: 135, width: 260, height: 196 };
  const stationary = { x: 360, y: 80, width: 260, height: 196 };
  assert.equal(
    positionedConnectionPath(moved, stationary).path,
    "M365,233 C362.5,233 362.5,178 360,178",
  );
  assert.equal(
    positionedConnectionPath(stationary, moved).path,
    "M620,178 C362.5,178 362.5,233 105,233",
  );
});
