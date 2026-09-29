export function EmptyWork({
  filtered = false,
  headingLevel = 3,
}: {
  filtered?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="empty-work">
      <span className="empty-mark" aria-hidden="true">
        [ ↗ ]
      </span>
      <div>
        <p className="micro">
          {filtered ? "NO MATCHING PROJECTS" : "THE WORK LIBRARY / IN PROGRESS"}
        </p>
        <Heading className="empty-title">
          {filtered ? "More systems to come." : "Real work. A closer look. Soon."}
        </Heading>
        <p>
          {filtered
            ? "There are no published projects in this category yet. Browse all work or choose another category."
            : "I’m preparing project breakdowns with workflow diagrams, screenshots, and walkthroughs. Each one will show what was built and how it works."}
        </p>
      </div>
      <span className="empty-index" aria-hidden="true">
        00
      </span>
    </div>
  );
}
