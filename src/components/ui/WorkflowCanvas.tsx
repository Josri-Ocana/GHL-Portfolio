"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import type { WorkflowConnection, WorkflowNode } from "@/types/project";
import {
  defaultNodePosition,
  validateWorkflowGraph,
  workflowAncestors,
  workflowConnectionPath,
  positionedConnectionPath,
  scrollWorkflowCount,
  workflowNodeReveal,
  revealedNodeBounds,
  type NodeBounds,
} from "@/lib/workflowCanvas";
import { WorkflowIcon } from "./WorkflowIcon";
import { motion } from "@/lib/motion";

function subscribeMotion(change: () => void) {
  const preference = window.matchMedia(motion.allowed);
  preference.addEventListener("change", change);
  return () => preference.removeEventListener("change", change);
}
const motionAllowed = () => window.matchMedia(motion.allowed).matches;
const serverMotionAllowed = () => false;

type CanvasGeometry = { width: number; height: number; nodes: Record<string, NodeBounds> };
const INTERACTIVE_NODE_WIDTH = 260;
const INTERACTIVE_NODE_GAP = 50;
type NodePosition = { x: number; y: number };
type NodeDrag = NodePosition & {
  id: string;
  pointerId: number;
  clientX: number;
  clientY: number;
  scrollLeft: number;
  scrollTop: number;
};

/** Project maps with an optional progressively revealed, draggable Page to CRM workspace. */
export function WorkflowCanvas({
  nodes,
  connections,
  label = "Project workflow",
  interaction = "read-only",
}: {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  label?: string;
  interaction?: "read-only" | "drag-nodes";
}) {
  validateWorkflowGraph(nodes, connections);
  const root = useRef<HTMLOListElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<NodeDrag | null>(null);
  const interactive = interaction === "drag-nodes";
  const [visibleCount, setVisibleCount] = useState(1);
  const [nodeWidth, setNodeWidth] = useState(INTERACTIVE_NODE_WIDTH);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [workspaceWidth, setWorkspaceWidth] = useState(0);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const animate = useSyncExternalStore(subscribeMotion, motionAllowed, serverMotionAllowed);
  const moved = useRef(false);
  const [fittedCount, setFittedCount] = useState(1);
  const displayedNodes = interactive ? nodes.slice(0, visibleCount) : nodes;
  const [positions, setPositions] = useState<Record<string, NodePosition>>(() =>
    Object.fromEntries(
      nodes.map((node, index) => [
        node.id,
        { x: 50 + index * (INTERACTIVE_NODE_WIDTH + INTERACTIVE_NODE_GAP), y: 80 },
      ]),
    ),
  );
  const [contentSize, setContentSize] = useState({
    width: 310,
    height: 360,
  });
  const [dragging, setDragging] = useState<string | null>(null);
  const prefix = useId();
  const [geometry, setGeometry] = useState<CanvasGeometry | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const reading = current || (interactive && scrollLeft > 0
    ? nodes[Math.min(visibleCount - 1, Math.max(0, Math.floor((scrollLeft + workspaceWidth / 2 - 50) / (nodeWidth + INTERACTIVE_NODE_GAP))))]?.id
    : null);
  const earlier = workflowAncestors(reading, connections);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const nodeAnchor = (id: string) => `${prefix}-node-${nodes.findIndex((node) => node.id === id)}`;
  const nodeReveal = (id: string) => {
    if (!interactive || !animate || dragging === id || focusedNodeId === id) return 1;
    return workflowNodeReveal(nodes.findIndex((node) => node.id === id), fittedCount, scrollLeft, nodeWidth + INTERACTIVE_NODE_GAP);
  };

  const updateProgress = () => {
    const element = viewport.current;
    if (!element || drag.current) return;
    setScrollLeft(element.scrollLeft);
    const count = scrollWorkflowCount(nodes.length, fittedCount, element.scrollLeft, nodeWidth + INTERACTIVE_NODE_GAP);
    const focusedNode = document.activeElement?.closest<HTMLElement>("[data-canvas-node]");
    if (focusedNode && nodes.slice(count).some((node) => node.id === focusedNode.dataset.canvasNode))
      element.focus({ preventScroll: true });
    if (current && nodes.slice(count).some((node) => node.id === current)) setCurrent(null);
    setVisibleCount(count);
  };

  useEffect(() => {
    const element = viewport.current;
    if (!interactive || !element) return;
    const observer = new ResizeObserver(() => {
      const width = element.clientWidth;
      setWorkspaceWidth(width);
      const cardWidth = moved.current ? nodeWidth : Math.min(INTERACTIVE_NODE_WIDTH, Math.max(1, width - 32));
      const inset = Math.min(50, Math.max(16, (width - cardWidth) / 2));
      setNodeWidth(cardWidth);
      const fit = Math.floor((width - inset + INTERACTIVE_NODE_GAP) / (cardWidth + INTERACTIVE_NODE_GAP));
      const fitted = Math.min(nodes.length, Math.max(1, fit));
      setFittedCount(fitted);
      setScrollLeft(element.scrollLeft);
      setVisibleCount(scrollWorkflowCount(nodes.length, fitted, element.scrollLeft, cardWidth + INTERACTIVE_NODE_GAP));
      if (!moved.current) {
        setPositions(Object.fromEntries(nodes.map((node, index) => [
          node.id,
          { x: inset + index * (cardWidth + INTERACTIVE_NODE_GAP), y: 80 },
        ])));
      }
      // Reserve the full scroll range so retracting nodes never clamps or jumps the viewport.
      const fullWidth = inset + Math.max(0, nodes.length - 1) * (cardWidth + INTERACTIVE_NODE_GAP) + cardWidth + 50;
      setContentSize((previous) => ({ ...previous, width: Math.max(width, fullWidth, moved.current ? previous.width : 0) }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [interactive, nodes, nodeWidth]);

  useEffect(() => {
    const element = viewport.current;
    if (!interactive || !element) return;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || drag.current || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || element.scrollHeight > element.clientHeight) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1);
      const next = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, element.scrollLeft + delta));
      if (next === element.scrollLeft) return;
      event.preventDefault();
      element.scrollLeft = next;
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [interactive]);

  const moveNode = (id: string, position: NodePosition) => {
    const next = { x: Math.max(0, position.x), y: Math.max(0, position.y) };
    setPositions((previous) => ({ ...previous, [id]: next }));
    setContentSize((previous) => ({
      width: Math.max(previous.width, next.x + nodeWidth + 50),
      height: Math.max(previous.height, next.y + (geometry?.nodes[id]?.height || 240) + 50),
    }));
  };
  const beginDrag = (event: PointerEvent<HTMLLIElement>, id: string) => {
    if (
      event.button !== 0 ||
      !event.isPrimary ||
      (event.target instanceof Element && event.target.closest("a, button"))
    )
      return;
    event.preventDefault();
    moved.current = true;
    const position = positions[id];
    drag.current = {
      id,
      ...position,
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      scrollLeft: viewport.current?.scrollLeft || 0,
      scrollTop: viewport.current?.scrollTop || 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    setDragging(id);
  };
  const continueDrag = (event: PointerEvent<HTMLLIElement>) => {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    moveNode(start.id, {
      x:
        start.x +
        event.clientX -
        start.clientX +
        (viewport.current?.scrollLeft || 0) -
        start.scrollLeft,
      y:
        start.y +
        event.clientY -
        start.clientY +
        (viewport.current?.scrollTop || 0) -
        start.scrollTop,
    });
  };
  const finishDrag = (event: PointerEvent<HTMLLIElement>, cancel = false) => {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    if (cancel) moveNode(start.id, start);
    drag.current = null;
    setDragging(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const keyboardMove = (event: KeyboardEvent<HTMLLIElement>, id: string) => {
    if (event.target !== event.currentTarget) return;
    const distance = event.shiftKey ? 50 : 20;
    const offsets: Record<string, NodePosition> = {
      ArrowLeft: { x: -distance, y: 0 },
      ArrowRight: { x: distance, y: 0 },
      ArrowUp: { x: 0, y: -distance },
      ArrowDown: { x: 0, y: distance },
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    moved.current = true;
    moveNode(id, { x: positions[id].x + offset.x, y: positions[id].y + offset.y });
  };

  useEffect(() => {
    const list = root.current;
    if (!list) return;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed) return;
        const bounds: Record<string, NodeBounds> = {};
        list.querySelectorAll<HTMLElement>("[data-canvas-node]").forEach((element) => {
          bounds[element.dataset.canvasNode!] = {
            x: element.offsetLeft,
            y: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight,
          };
        });
        const next = { width: list.clientWidth, height: list.clientHeight, nodes: bounds };
        setGeometry((previous) =>
          JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
        );
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    list
      .querySelectorAll<HTMLElement>("[data-canvas-node]")
      .forEach((node) => observer.observe(node));
    measure();
    void document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [nodes, visibleCount]);

  if (!nodes.length) return null;
  const diagram = (
    <>
      <ol
        ref={root}
        className="workflow-canvas-grid"
        role="list"
        style={interactive ? { width: contentSize.width, height: contentSize.height } : undefined}
        onMouseLeave={() => setCurrent(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setCurrent(null);
        }}
      >
        {displayedNodes.map((node, index) => {
          const reveal = nodeReveal(node.id);
          const position = node.position ?? defaultNodePosition(index);
          const outgoing = connections.filter((edge) => edge.from === node.id);
          const state =
            reading === node.id
              ? "current"
              : earlier.has(node.id)
                ? "completed"
                : reading
                  ? "upcoming"
                  : "idle";
          return (
            <li
              key={node.id}
              id={nodeAnchor(node.id)}
              className="workflow-canvas-node"
              role="listitem"
              tabIndex={interactive ? 0 : undefined}
              aria-describedby={interactive ? `${prefix}-instructions` : undefined}
              data-canvas-node={node.id}
              data-state={state}
              data-dragging={dragging === node.id || undefined}
              data-revealing={reveal > 0 && reveal < 1 || undefined}
              style={
                interactive
                  ? ({
                      left: positions[node.id].x,
                      top: positions[node.id].y,
                      width: nodeWidth,
                      "--node-reveal": reveal,
                    } as CSSProperties)
                  : ({
                      "--node-column": position.x + 1,
                      "--node-row": position.y + 1,
                    } as CSSProperties)
              }
              onPointerDown={interactive ? (event) => beginDrag(event, node.id) : undefined}
              onPointerMove={interactive ? continueDrag : undefined}
              onPointerUp={interactive ? (event) => finishDrag(event) : undefined}
              onPointerCancel={interactive ? (event) => finishDrag(event, true) : undefined}
              onLostPointerCapture={
                interactive
                  ? () => {
                      drag.current = null;
                      setDragging(null);
                    }
                  : undefined
              }
              onKeyDown={interactive ? (event) => keyboardMove(event, node.id) : undefined}
              onMouseEnter={() => setCurrent(node.id)}
              onFocus={() => {
                setCurrent(node.id);
                setFocusedNodeId(node.id);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocusedNodeId(null);
              }}
            >
              <span className="micro workflow-canvas-step">
                <span>
                  {String(index + 1).padStart(2, "0")} / {node.type || "step"}
                </span>
                <span className="workflow-canvas-marker" aria-hidden="true" />
              </span>
              <WorkflowIcon name={node.icon || "workflow"} />
              <h3>{node.title}</h3>
              {node.description && (
                <p className="workflow-canvas-description">{node.description}</p>
              )}
              {outgoing.length > 0 && (
                <ul className="workflow-canvas-routes" aria-label="Next steps">
                  {outgoing.map((edge) => (
                    <li key={edge.to} className={edge.label || edge.branch ? undefined : "sr-only"}>
                      {(edge.label || edge.branch) && displayedNodes.some((node) => node.id === edge.to) ? (
                        <a href={`#${nodeAnchor(edge.to)}`}>
                          <span className="workflow-canvas-branch">
                            {edge.label || edge.branch}
                          </span>
                          <span>{nodeById.get(edge.to)!.title}</span>
                        </a>
                      ) : (
                        `Next: ${nodeById.get(edge.to)!.title}`
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {!outgoing.length && <span className="sr-only">End of this workflow path.</span>}
            </li>
          );
        })}
      </ol>
      {geometry && (
        <svg
          className="workflow-canvas-connectors"
          width={interactive ? contentSize.width : geometry.width}
          height={interactive ? contentSize.height : geometry.height}
          aria-hidden="true"
          focusable="false"
        >
          {connections.map((edge) => {
            const from = geometry.nodes[edge.from];
            const to = geometry.nodes[edge.to];
            if (!from || !to) return null;
            if (!displayedNodes.some((node) => node.id === edge.from) || !displayedNodes.some((node) => node.id === edge.to)) return null;
            const path = (interactive ? positionedConnectionPath : workflowConnectionPath)(
              interactive ? revealedNodeBounds({ ...from, ...positions[edge.from] }, nodeReveal(edge.from)) : from,
              interactive ? revealedNodeBounds({ ...to, ...positions[edge.to] }, nodeReveal(edge.to)) : to,
              interactive ? contentSize.width : geometry.width,
            );
            const state =
              reading === edge.from
                ? "current"
                : earlier.has(edge.from) && (earlier.has(edge.to) || reading === edge.to)
                  ? "completed"
                  : "upcoming";
            const reveal = Math.max(0, Math.min(1, (Math.min(nodeReveal(edge.from), nodeReveal(edge.to)) - 0.18) / 0.82));
            return (
              <g key={`${edge.from}-${edge.to}`} data-state={state} data-revealing={reveal > 0 && reveal < 1 || undefined}>
                <path d={path.path} fill="none" strokeWidth="1.5" strokeLinecap="round"
                  pathLength={interactive ? 1 : undefined}
                  style={interactive ? { strokeDasharray: 1, strokeDashoffset: 1 - reveal } : undefined}
                />
              </g>
            );
          })}
        </svg>
      )}
    </>
  );
  return (
    <div
      className={`workflow-canvas${interactive ? " workflow-canvas--interactive" : ""}`}
      role="group"
      aria-label={label}
    >
      {interactive ? (
        <>
          <div className="workflow-canvas-toolbar">
            <p id={`${prefix}-instructions`} className="micro workflow-canvas-instructions">
              DRAG NODES / SCROLL TO REVEAL
              <span className="sr-only">
                {" "}
                Focus the workspace to scroll with arrow keys. Focus a node to move it with arrow
                keys; hold Shift for larger moves. Scroll forward to reveal steps and back to retract
                them. Swipe the background horizontally on touch devices.
              </span>
            </p>
            <span className="micro workflow-canvas-count" aria-hidden="true">{visibleCount} / {nodes.length}</span>
          </div>
          {visibleCount < nodes.length && (
            <ol className="sr-only" aria-label="Remaining workflow steps">
              {nodes.slice(visibleCount).map((node) => (
                <li key={node.id}>{node.title}{node.description && `: ${node.description}`}</li>
              ))}
            </ol>
          )}
          <div
            ref={viewport}
            className="workflow-canvas-viewport"
            role="region"
            aria-label={`${label} — scrollable workspace`}
            tabIndex={0}
            data-lenis-prevent
            onScroll={updateProgress}
          >
            <div className="workflow-canvas-track">{diagram}</div>
          </div>
        </>
      ) : (
        diagram
      )}
    </div>
  );
}
