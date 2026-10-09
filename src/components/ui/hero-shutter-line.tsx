import "@/styles/hero-shutter.css";

/** Interaction reference: Hero Shutter Text by daiwiikharihar on 21st.dev.
 * Adapted to whole-line monochrome slices; the existing GSAP scene owns motion.
 */
export function HeroShutterLine({ text, outlined }: { text: string; outlined: boolean }) {
  const words = (animated: boolean) =>
    text.split(" ").map((word, index) => (
      <span key={word}>
        {index > 0 && " "}
        <span {...(animated ? { "data-hero-word": true } : {})}>{word}</span>
      </span>
    ));
  return (
    <span className="line-mask hero-shutter-line">
      <span data-hero-line className={outlined ? "outline-word" : ""}>
        {words(true)}
      </span>
      <span className="hero-shutter-slices" aria-hidden="true">
        {[0, 1, 2].map((slice) => (
          <span className={`hero-shutter-slice${outlined ? " outline-word" : ""}`} key={slice}>
            {words(false)}
          </span>
        ))}
      </span>
    </span>
  );
}
