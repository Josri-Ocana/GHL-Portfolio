export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={diagonal ? "arrow diagonal" : "arrow"}
    >
      <path d="M4 12h15M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
