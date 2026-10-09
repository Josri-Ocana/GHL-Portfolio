import { skillGroups, toolkitCopy } from "@/data/skills";
import { SectionLabel } from "@/components/ui/SectionLabel";
import "@/styles/tools.css";

export function Tools() {
  return (
    <section id="tools" className="tools-section section wrap" aria-labelledby="tools-title">
      <SectionLabel number="07">THE TOOLKIT</SectionLabel>
      <div className="toolkit-heading">
        <h2 id="tools-title">
          {toolkitCopy.headline[0]}
          <br />
          {toolkitCopy.headline[1]}
        </h2>
        <p>{toolkitCopy.introduction}</p>
      </div>
      <div className="toolkit-columns" aria-hidden="true">
        <span>Capability / purpose</span>
        <span>Tools / technologies</span>
      </div>
      <div className="toolkit-index">
        {skillGroups.map((group, index) => (
          <article
            className="toolkit-entry"
            key={group.title}
            aria-labelledby={`toolkit-category-${index}`}
          >
            <div className="toolkit-capability">
              <span className="toolkit-ordinal" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <h3 id={`toolkit-category-${index}`}>{group.title}</h3>
                <p>{group.purpose}</p>
              </div>
            </div>
            <ul className="toolkit-tools" aria-label={`${group.title} tools`}>
              {group.tools.map((tool, toolIndex) => (
                <li
                  className={
                    toolIndex < group.featuredToolCount ? "toolkit-core" : "toolkit-support"
                  }
                  key={tool}
                >
                  {tool}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
