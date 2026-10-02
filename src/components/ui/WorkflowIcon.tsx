import type { WorkflowSymbol } from "@/types/project";

const symbols = {
  workflow: (
    <>
      <rect x="3" y="3" width="6" height="6" />
      <rect x="15" y="15" width="6" height="6" />
      <path d="M6 9v9h9M9 6h9v9" />
    </>
  ),
  trigger: <path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z" />,
  webhook: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M9 6h5a4 4 0 0 1 4 4v5M15 18h-5a4 4 0 0 1-4-4v-5m9-2 3 3 3-3M3 14l3-3 3 3" />
    </>
  ),
  json: (
    <>
      <path d="M8 3H6v6l-3 3 3 3v6h2m8-18h2v6l3 3-3 3v6h-2" />
      <path d="M11 9h2m-2 6h2" />
    </>
  ),
  mapping: (
    <>
      <path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 3-2 4-4m4-4c1-2 2-4 4-4h3m-4-4 4 4-4 4" />
    </>
  ),
  integration: <path d="M8 3v5m8-5v5M6 8h12v4a6 6 0 0 1-12 0V8Zm6 10v4" />,
  validation: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="m7 12 3 3 7-7" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
    </>
  ),
};

/** Decorative symbols follow the repository's existing inline SVG convention. */
export function WorkflowIcon({ name }: { name: WorkflowSymbol }) {
  return (
    <svg
      className="workflow-icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {symbols[name]}
    </svg>
  );
}
