import type {
  Project,
  WorkflowCanvasDefinition,
  WorkflowConnection,
  WorkflowNode,
} from "../types/project";

/** Resolve existing steps instead of maintaining a second copy of project prose. */
export function projectCanvas(project: Project, definition: WorkflowCanvasDefinition) {
  const steps: WorkflowNode[] = (project.workflowSteps || []).map((step, index) => ({
    id: step.id || `${project.slug}-step-${index + 1}`,
    title: step.title,
    description: step.description,
    icon: step.icon,
    type: step.type,
  }));
  const byId = new Map(steps.map((step) => [step.id, step]));
  const nodes =
    definition.nodes ??
    (definition.stepIds
      ? definition.stepIds.map((id) => {
          const step = byId.get(id);
          if (!step) throw new Error(`Unknown workflow step: ${project.slug}/${id}`);
          return step;
        })
      : steps);
  const connections =
    definition.connections ??
    nodes.slice(1).map((node, index) => ({
      from: nodes[index].id,
      to: node.id,
    }));
  validateWorkflowGraph(nodes, connections);
  return { nodes, connections };
}

export function validateWorkflowGraph(nodes: WorkflowNode[], connections: WorkflowConnection[]) {
  const ids = new Set(nodes.map((node) => node.id));
  if (ids.size !== nodes.length) throw new Error("Duplicate workflow node IDs");
  const positions = new Set<string>();
  for (const node of nodes) {
    if (!node.id.trim() || !node.title.trim())
      throw new Error("Workflow nodes need IDs and titles");
    if (node.position) {
      const { x, y } = node.position;
      if (![x, y].every((value) => Number.isSafeInteger(value) && value >= 0) || x > 2)
        throw new Error("Workflow positions must use nonnegative grid rows and columns 0–2");
      const key = `${x}/${y}`;
      if (positions.has(key)) throw new Error("Overlapping workflow positions");
      positions.add(key);
    }
  }
  const edges = new Set<string>();
  for (const connection of connections) {
    if (!ids.has(connection.from) || !ids.has(connection.to))
      throw new Error("Workflow connection references an unknown node");
    if (connection.from === connection.to) throw new Error("Self-referencing workflow connection");
    const key = `${connection.from}/${connection.to}`;
    if (edges.has(key)) throw new Error("Duplicate workflow connections");
    edges.add(key);
  }
  // Validate resolved positions too, including mixed supplied/automatic placement.
  const resolved = nodes.map((node, index) => {
    const position = node.position ?? defaultNodePosition(index);
    return `${position.x}/${position.y}`;
  });
  if (new Set(resolved).size !== resolved.length) throw new Error("Overlapping workflow positions");
}

export function defaultNodePosition(index: number) {
  const y = Math.floor(index / 3);
  return { x: y % 2 === 0 ? index % 3 : 2 - (index % 3), y };
}

export type NodeBounds = { x: number; y: number; width: number; height: number };

/** Original supplied component's right-edge to left-edge cubic path, including while dragging. */
export function positionedConnectionPath(from: NodeBounds, to: NodeBounds) {
  const startX = from.x + from.width;
  const startY = from.y + from.height / 2;
  const endX = to.x;
  const endY = to.y + to.height / 2;
  const controlX = (startX + endX) / 2;
  return {
    path: `M${startX},${startY} C${controlX},${startY} ${controlX},${endY} ${endX},${endY}`,
  };
}

/** Supplied component's cubic SVG connectors, adapted to measured responsive cards. */
export function workflowConnectionPath(from: NodeBounds, to: NodeBounds, width: number) {
  const fromCenter = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const toCenter = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  if (Math.abs(from.y - to.y) < 1) {
    const right = to.x > from.x;
    const startX = right ? from.x + from.width : from.x;
    const endX = right ? to.x : to.x + to.width;
    const controlX = (startX + endX) / 2;
    return {
      path: `M${startX},${fromCenter.y} C${controlX},${fromCenter.y} ${controlX},${toCenter.y} ${endX},${toCenter.y}`,
      labelX: controlX,
      labelY: (fromCenter.y + toCenter.y) / 2,
    };
  }
  const down = to.y > from.y;
  const startY = down ? from.y + from.height : from.y;
  const endY = down ? to.y : to.y + to.height;
  const controlY = (startY + endY) / 2;
  // Long edges use an outside rail so skipped mobile nodes are never crossed.
  if (Math.abs(from.x - to.x) < 1 && Math.abs(endY - startY) > 150) {
    const rail = width - 12;
    return {
      path: `M${fromCenter.x},${startY} C${rail},${startY} ${rail},${startY} ${rail},${startY + (down ? 24 : -24)} L${rail},${endY - (down ? 24 : -24)} C${rail},${endY} ${rail},${endY} ${toCenter.x},${endY}`,
      labelX: rail,
      labelY: controlY,
    };
  }
  return {
    path: `M${fromCenter.x},${startY} C${fromCenter.x},${controlY} ${toCenter.x},${controlY} ${toCenter.x},${endY}`,
    labelX: (fromCenter.x + toCenter.x) / 2,
    labelY: controlY,
  };
}

export function workflowAncestors(id: string | null, connections: WorkflowConnection[]) {
  const earlier = new Set<string>();
  if (!id) return earlier;
  const pending = [id];
  while (pending.length) {
    const target = pending.pop()!;
    for (const connection of connections) {
      if (connection.to === target && connection.from !== id && !earlier.has(connection.from)) {
        earlier.add(connection.from);
        pending.push(connection.from);
      }
    }
  }
  return earlier;
}
/** Reveal one more approved step per horizontal card interval; reverse scrolling retracts it. */
export function scrollWorkflowCount(total: number, fitted: number, scrollLeft: number, stride: number) {
  return Math.min(total, Math.max(1, fitted) + Math.ceil(Math.max(0, scrollLeft) / stride));
}

/** Complete the reveal early in each interval, leaving the rest for reading. */
export function workflowNodeReveal(index: number, fitted: number, scrollLeft: number, stride: number) {
  if (index < fitted) return 1;
  const distance = Math.min(180, stride * 0.6);
  const progress = Math.max(0, Math.min(1, (scrollLeft - (index - fitted) * stride) / distance));
  return 1 - (1 - progress) ** 3;
}

/** Keep SVG endpoints attached to the same left-center transform used by the cards. */
export function revealedNodeBounds(bounds: NodeBounds, progress: number): NodeBounds {
  const scale = 0.94 + progress * 0.06;
  return {
    x: bounds.x + (1 - progress) * 40,
    y: bounds.y + (1 - progress) * 24 + bounds.height * (1 - scale) / 2,
    width: bounds.width * scale,
    height: bounds.height * scale,
  };
}
