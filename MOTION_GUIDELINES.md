# Motion guidelines

## Engine and plugin selection

GSAP is preferred for complex cinematic sequences, scroll choreography, typography and SVG animation. Use CSS for static presentation and simple hover/focus transitions. Keep native interactions when they are simpler; do not convert working components merely to standardize engines.

Inspected 2026-10-09: installed GSAP **3.15.0** exports core and individual plugin subpaths with TypeScript declarations. Application code explicitly uses **ScrollTrigger** and **SplitText**; CSSPlugin is bundled with core. No Framer Motion or `@gsap/react` dependency is installed. Existing `useMotionScene` provides scoped lifecycle management; adding `useGSAP` is unnecessary for this setup.

| Capability already available in GSAP | Appropriate use / constraint                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ScrollTrigger                        | Activation, scrubbed progress and purposeful pins; not a second smoothing engine.                                                                            |
| SplitText                            | Line/word typography; split only necessary content, preserve accessible text, revert splits and rebuild after font/wrapping changes.                         |
| Flip                                 | Transitions between real layout states, such as preview selection; React owns the resulting semantic layout.                                                 |
| MorphSVGPlugin                       | Meaningful SVG shape transformations; avoid decorative morphing without a communication purpose.                                                             |
| MotionPathPlugin                     | Data/token movement along a diagram path; account for responsive SVG coordinates.                                                                            |
| Draggable                            | Direct manipulation when native pointer handling is insufficient; supply keyboard controls and preserve touch scrolling.                                     |
| Observer                             | Local gesture interpretation when needed; never hijack page scrolling or duplicate Lenis input handling.                                                     |
| ScrollToPlugin                       | Exceptional controlled navigation only; use existing native/Next/Lenis navigation by default. Never combine competing scroll tweens or CSS smooth scrolling. |
| CustomEase                           | A reusable, measured easing requirement; existing `src/lib/motion.ts` eases remain the default.                                                              |
| ScrambleTextPlugin / TextPlugin      | Brief, meaningful decorative text changes; keep essential text immediately readable and avoid live-region noise.                                             |
| DrawSVGPlugin                        | SVG connection/progress drawing when existing stroke-dash animation is insufficient.                                                                         |
| InertiaPlugin                        | Purposeful drag momentum only; not needed by the current workflow canvas.                                                                                    |

GSDevTools and MotionPathHelper are development aids, not production UI defaults. ScrollSmoother would compete with Lenis and must not be added alongside it. Physics, Pixi/Easel and bounce/wiggle plugins are available but have no demonstrated need here.

Import a plugin from its individual `gsap/<PluginName>` subpath and register it before use in the client effect/module that needs it. Do not import `gsap/all`, register every plugin, load browser plugins in Server Components, or install dependencies preemptively. Registration in several existing modules is harmless; it does not create multiple scroll engines.

## Ownership in this repository

| Owner                                                    | Responsibility                                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Lenis (`layout/SmoothScroll.tsx`, `lib/smoothScroll.ts`) | One page wheel-smoothing instance using native window scroll.                              |
| ScrollTrigger                                            | Measures scroll position and supplies activation, pinning and scene progress.              |
| GSAP                                                     | Owns timeline choreography and its assigned transform/opacity/SVG properties.              |
| React                                                    | Content, navigation, selection and other semantic/application state.                       |
| CSS                                                      | Static layout, tokens and simple UI states on properties not owned by an active animation. |

Lenis has `autoRaf: false`; the single GSAP ticker calls `lenis.raf(seconds * 1000)`, and Lenis scroll events call `ScrollTrigger.update`. Fine-hover pointers with normal motion enable smoothing; touch/coarse pointers and reduced motion use native scrolling. Anchors remain native/Next-owned. `portfolio:scroll-restored` synchronizes Lenis after existing history restoration; do not force top on pathname changes. No additional scroll wrapper, scroller proxy, smoothing engine or global RAF is needed.

Existing intentional exceptions stay intact: WorksWheel's visibility-paused RAF owns card transforms and center-label opacity using ScrollTrigger's target progress; the hero's on-demand RAF owns its pointer reveal clip; ScrollRestoration's bounded RAF restores history position. WorkflowCanvas uses native pointer/keyboard manipulation and React node positions. These are not additional page smoothing engines. Do not introduce GSAP/CSS/React writes to those same animated properties. CSS diagram hover moves the outer SVG while GSAP choreographs its inner nodes.

## Lifecycle, readiness and accessibility

- Prefer the existing `src/hooks/useMotionScene.ts` with a stable module-scope setup callback and root-scoped selectors/refs. Its `gsap.matchMedia()` context captures setup animations/triggers and reverts on media changes/unmount. Standalone scenes use scoped `gsap.context()` or matchMedia and revert their own context; do not use global `killAll`.
- Animations created later in handlers/timers must join their owning context or be explicitly tracked/killed. If a future justified `useGSAP` adoption occurs, use its `contextSafe` for delayed handlers. Also remove event listeners, observers, RAFs and timers; revert SplitText DOM changes. Cleanup must withstand Strict Mode, route changes and media changes.
- Refresh only after geometry changes: scene setup, settled fonts, decoded/sized media, completed disclosure transitions or responsive reflow. Reserve image dimensions. Use `update` for scroll progress, not `refresh`. Queue/coalesce refreshes, cancel stale callbacks, sort upstream pins before dependent measurements, and never refresh every frame or from a refresh callback. The shared hook already handles fonts/load/disclosures/pageshow; avoid adding redundant listeners.
- Reuse `src/lib/motion.ts` gates/intensity/ease defaults. Desktop/tablet shared gates also require 720px viewport height. Signature scenes have intentional dedicated gates; preserve them. Use matchMedia to rebuild/revert, not breakpoint polling. Reduced-motion and no-JavaScript content must be readable in normal flow with no pin, hidden copy or decorative split remnants.
- Render stable semantic HTML on the server. Perform DOM measurements/splitting after client mount and font readiness; never use browser dimensions/random animation state during server render. Keep one semantic heading and hide decorative duplicates from accessibility APIs. Do not replace React-owned text or layout imperatively without a clear boundary.
- Preserve focus visibility, reading order, links, keyboard navigation and native touch scrolling. Pointer effects need a usable static fallback. Never require animation completion to access essential content; reveal focused content immediately. Avoid repeated announcements of decorative frame updates.
- Prefer transforms/opacity, bounded DOM reads and writes, on-demand/offscreen-paused work and discrete React state updates. Complex clipping/SVG/3D effects require actual frame/paint inspection; blanket `will-change`, `translateZ` or containment is not a safe performance fix.
- Pins must preserve document flow, reasonable reading holds and responsive escape paths. Measure immutable wrappers rather than animated geometry; avoid accidental nested pins. Test route/history return, deep links, reverse scroll and resize. Do not change refresh priorities, pin type or scene distances without a demonstrated defect.

## Protected implementation and known cautions

Preserve WorksWheel's exact measured, subpixel header-boundary clipping: it replaces the opaque header/card compositing that caused missing pixels. Do not alter the header appearance, clipping edge, card mounting, perspective, ring-to-drum geometry, center-label handoff or Project 01 hold as incidental cleanup. Preserve BUILD's measured safe glyph targeting/SVG camera, current hero behavior and existing case-study timeline choreography.

Current hero is the editorial `HeroTextReveal` prototype with shutter entrance; the earlier MagneticText component is retained but inactive. Do not restore it based on historical terminology. Implementation state/timings live in `HANDOFF.md`.

Inspection cautions, not newly proven regressions: independent `useMotionScene`, portal and wheel refresh queues can schedule duplicate global refreshes; future work should avoid multiplying them. `SmoothScroll` sets global `gsap.ticker.lagSmoothing(0)` without restoring it, so treat that as an existing app-wide policy with one owner. Outer section clips and inner scene motion need explicit property ownership before edits. Long cumulative pinned distances need usability review before adding pins. No refactor is authorized by these cautions.

## Future section direction and 21st.dev workflow

Audit priorities: **KEEP** Hero, BUILD, Selected Work, FAQ and navbar; **REFINE** What I Build, System Overview, Inside the Workflow, About, CTA, footer, archive and case studies; **RETHINK** Websites & Funnels, Process and Tools. These are future design directions, not permission to change them during setup.

- Websites & Funnels: Flip for purposeful preview/layout selection or ScrollTrigger for a bounded interface presentation; preserve actual project links and readable proof.
- Process: ScrollTrigger for one connected progress sequence with short readable holds and an unpinned mobile/reduced-motion alternative.
- Tools: CSS hover/focus and restrained optional GSAP entry; avoid a pin or decorative scramble.
- About: short GSAP opacity/translation or carefully scoped SplitText when justified; keep biography readable and avoid prolonged gating.

For a future component task: inspect the current section → search connected 21st.dev if useful → inspect real source/dependencies/license → evaluate GSAP suitability without automatically converting it → adapt to Josri's design system → implement only the chosen interaction → navigate/test the actual browser result → check performance, keyboard/touch and reduced motion. Preserve notices. Install only justified dependencies within the authorized implementation scope. If catalog quota is exhausted, do not retry repeatedly or bypass limits; continue independent work and report the blocked retrieval.

Meaningful implementation changes require the repository checks plus targeted visual testing at desktop/tablet/mobile, slow forward/reverse, stop/resume and route navigation. Run browser suites sequentially because reports/artifacts are shared. Documentation-only setup uses formatting/diff checks, not expensive rebuilds or browser suites.

Official references: [plugin inventory](https://gsap.com/docs/v3/Plugins/), [React lifecycle](https://gsap.com/resources/React/), [matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>), [refresh](<https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.refresh()/>), [SplitText readiness](https://gsap.com/docs/v3/Plugins/SplitText/). Individual plugin guides are linked from the inventory; check current official APIs before implementing.
