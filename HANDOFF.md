# Technical handoff

## Current state

Final checkpoint for Friday, 2026-10-02: the design is **not final**. Preserve the current successful implementation when resuming on Monday, 2026-10-05. Today's case-study timeline, milestone content, earlier copy timing, CTA verification and global Lenis integration are complete. Detailed implementation and verification limits appear below; the final checkpoint and MONDAY DESIGN RESUME sections are the current resume instructions.

CTA implementation is preserved and its populated controls were verified on 2026-10-02. Shared styles, behavior, check results and remaining verification limits are recorded in the CTA section below. No redesign was performed.

Section 04 technical storytelling rework complete (2026-09-29). Section 02 is the conceptual System Overview; Section 04 is a seven-state automation with appointment branching. The workflow implementation and validation below supersede earlier five-stage workflow notes.

Work Grid & Case Study UX Refinement complete (2026-09-29), including nine explicitly labeled demo records. Current work presentation and replacement guidance are documented below. No demo represents client work or measured results.

Transition and intensity pass complete (2026-09-28), extending the verified 2026-09-24 motion pass. The approved layout, monochrome design, content, routes, and SEO are preserved. The two signature scenes have scroll-driven timelines; supporting sections have restrained reveals. That pass added no dependencies; today's global scrolling pass added Lenis. The workspace uses its existing Git repository and origin remote; today's changes are included in the single checkpoint described below.

Homepage, work library, dynamic case study route, reusable media, metadata, sitemap, robots, and structured data are implemented. Nine published records are explicitly labeled demos. No real project data, confirmed email, social URLs, or production domain were supplied. These remain unconfigured. Remote deployment status has not been verified.

Validation results are recorded below. Do not publish the template as a real case study.

## Stack and structure

Next.js App Router; React; strict TypeScript; Tailwind CSS through PostCSS; GSAP/ScrollTrigger; Lenis 1.3.26 driven by the GSAP ticker. No WebGL, database, CMS, contact backend, or secret credentials. Server Components are the default.

- `src/app`: home, work index, case studies, 404, layout, sitemap, robots, icon, generated Open Graph image.
- `src/data`: site identity/contact/hero, navigation, services/process, skills, FAQs, projects, metadata helper.
- `src/types/project.ts`: typed content contract and category list.
- `src/components/sections`: independently editable home sections.
- `src/components/layout`: responsive navigation, footer and the global SmoothScroll client component.
- `src/components/work`: cards, empty state, CaseArchitecture wrapper and homepage workflow diagram.
- `src/components/ui/timeline.tsx`: supplied horizontal case-study timeline; WorkflowIcon.tsx supplies decorative technical symbols.
- `src/components/media`: click-to-load walkthrough player.
- `src/components/animations`: scoped page entrance/reveal logic.
- `src/components/seo`: safely serialized JSON-LD.
- `src/lib/media.ts`: URL validation and provider normalization.
- `src/lib/projectTimeline.ts`: workflowSteps-to-milestones mapping; `src/lib/smoothScroll.ts`: global wheel-scroll configuration.
- `src/styles/globals.css`: shared tokens, editorial components, responsive and reduced-motion rules.
- `tests/content.test.ts`: ten tests covering draft visibility, demo/content integrity, media URLs, milestone mapping and workflow branches.

## Common edits

| Change                                                 | Location                                    |
| ------------------------------------------------------ | ------------------------------------------- |
| Name, verified email, social links, hero, contact copy | `src/data/site.ts`                          |
| Services and six-stage process                         | `src/data/services.ts`                      |
| Skills, FAQs, navigation                               | Corresponding `src/data` file               |
| Projects and results                                   | `src/data/projects.ts`                      |
| Category names                                         | `src/types/project.ts`                      |
| Global palette, widths, spacing, timing                | `:root` in `src/styles/globals.css`         |
| Fonts                                                  | `src/app/layout.tsx` via `next/font/google` |
| Signature scroll scene                                 | `src/components/sections/SystemStory.tsx`   |

## Project publishing

Copy the hidden template, assign a unique lowercase hyphenated slug, replace all placeholders, and add verified content. Set `published: true` only when ready. `featured: true` prioritizes the homepage. The home shows up to three featured projects, falling back to the first three published entries. Websites & Funnels shows the first four published Websites or Funnels entries.

Local images belong under `public/projects/<slug>/`; reference them as `/projects/<slug>/image.webp`. Use approved, redacted images with meaningful alt text. Keep images compressed. Default image handling intentionally supports local assets only; external image sources require a narrowly scoped `images.remotePatterns` in `next.config.ts`. Next Image reserves dimensions and optimizes local files. Image galleries preserve original proportions.

Supported fields: category, tags, tools, role, year, status, confidential/client name, cover, mobile screenshot, gallery/captions, problem, solution, workflow steps, results, live/repository/resource links, and video. Optional sections render only when populated. Confidential projects suppress client names in the header; editors must also redact names and sensitive data in all copy/assets.

Drafts are excluded from all public queries and static params and return 404 even with a guessed URL. No preview route or public test route exists. Filters are ordinary URL links (`/work?category=CRM`) rendered on the server, work without JavaScript, and expose current selection accessibly. Filtered views canonicalize to `/work` and are noindex to avoid duplicate indexing.

## Video

`VideoPlayer` supports Loom share/embed URLs, YouTube watch/short/embed URLs, Vimeo public/unlisted URLs, and local `/media/*.mp4` or HTTP(S) MP4 files. Provider hostnames and IDs are checked before constructing iframes. No iframe or video request loads before activation. No autoplay or autoplay sound is requested. Native controls, responsive 16:9 frames, descriptive titles, source fallback links, optional WebVTT captions for files, and an optional text transcript are supported. Configure captions on third-party providers and supply a transcript for accessibility. Add a local optimized poster to avoid a blank media tile. There are no live videos until real project media is supplied.

## Design and motion

Palette: white, warm white, near black, charcoal, gray. Flat borders and square corners. Fluid display sizes and bounded page widths protect ultrawide layouts. CSS breakpoints at 599, 899, and 1099 px simplify layout; larger desktops retain the full scene.

`useMotionScene` owns scoped GSAP matchMedia setup and reverts all animations and ScrollTriggers on breakpoint changes and unmount. Font readiness, captured image loads, disclosure toggles/height transitions, and pageshow queue sorted refreshes through requestAnimationFrame; listeners and pending frames are cleaned up. Server-rendered content is visible before JavaScript.

- `SystemStory` delegates to `animations/systemTimeline.ts`: central lead, staggered directional node/connection build, workflow label transition, complete-system hold, peripheral collapse, and a centered two-line final statement. Its cinematic class fills the viewport while pinned and is removed on cleanup.
- `WorkflowShowcase` delegates to `animations/workflowTimeline.ts`: desktop pins the diagram/copy composition, transitions seven states from TRIGGER through COMPLETE, expands Action and appointment branches, and retains the completed architecture. All steps remain in the semantic document; tablet/mobile use normal flow. See the technical workflow section below.
- `PageMotion` delegates to `animations/editorialTimeline.ts`: masked hero entrance and scrubbed exit, divider drawing, calm services, browser-frame expansion, six process reveals, skill dividers, About panel/line masks, and staggered CTA words.
- `ProjectReveal` wraps server-rendered project cards with media masks and copy stagger. Focus completes the reveal immediately for keyboard access. Native FAQ disclosure transitions use CSS feature detection with native fallback.

Tune shared easing, reveal/stagger duration, scrub smoothing, breakpoints, and pin distances in `src/lib/motion.ts`; stage timing and labels live in the two timeline modules. Desktop is at least 1100px wide and 720px tall: system pins for 3.6 viewport heights, workflow for 4.2. Tablet (700–1099px wide, at least 720px tall) pins only the system for 2.5 viewport heights. The system also checks that its content fits before pinning. Mobile and short viewports use normal flow and progressive reveals. Scrolling uses the native window, with global Lenis wheel interpolation on eligible devices and native touch behavior.

Reduced motion disables all GSAP setup, scrub, and pins; nodes, connections, and all workflow copy remain readable in static flow. CSS removes smooth scrolling and motion transitions. No preference override or test route remains in the source.

One-shot reveals use `toggleActions: "play none none none"`, retaining their triggers until context cleanup. Using `once: true` caused a GSAP refresh iteration error after completed triggers removed themselves during breakpoint recreation; repeat resize/navigation checks passed after this correction.

## Accessibility and responsiveness

Semantic sections, one h1 per page, native FAQ disclosures, focus styles, skip link, actual navigation links/buttons, no hover-only actions. Mobile navigation is a disclosure (not a modal), closes on selection, Escape, outside click, focus departure, or desktop resize. Escape restores focus to the toggle. Responsive filters wrap; no horizontal carousel is required. Illustrative diagrams are clearly labeled; the duplicated sticky workflow diagram is decorative to assistive technology.

## SEO, AEO, GEO

Unique page titles/descriptions, canonical URLs, Open Graph and Twitter image metadata, generated social image, semantic server-rendered content, project breadcrumbs, and truthful Person/WebSite/ProfilePage/CreativeWork/BreadcrumbList JSON-LD. FAQs are direct visible answers; no promises of rich results or search rankings. No fabricated ratings, employers, or metrics.

`NEXT_PUBLIC_SITE_URL` is the only environment variable. Set a final HTTP(S) origin at build time. When absent, metadata falls back to localhost, robots blocks crawling, and the sitemap is empty. This prevents accidental indexing of an unconfigured installation. Production should use HTTPS. No secrets are exposed or required.

## Deployment and maintenance

Use Node.js 22+ and `npm ci`. Run lint, typecheck, tests, then build. Deploy the repository to Vercel with the Next.js preset and the site URL variable. Fonts are downloaded at build time and self-hosted. Package versions are locked in `package-lock.json`. Basic security headers are configured; a restrictive CSP is not imposed because future approved third-party media hosts vary.

Git origin is configured as `https://github.com/Josri-Ocana/GHL-Portfolio.git`. Do not push or deploy without the user's instruction. Do not infer a domain, email, or client data. No backend contact form is presented: the verified mailto CTA appears only when configured.

Future changes should be local. Preserve unrelated sections, update this document when architecture changes, and verify replacements before removing old code or documentation.

## Known limitations and launch inputs

- Real case studies, screenshots, recordings, captions/transcripts, and results await supply.
- Confirm the correct email, social URLs, and public domain before launch.
- Current diagrams explain an illustrative process; they are not claimed as client work.
- No analytics, consent banner, contact submission service, CMS, or visual admin is installed.
- Video provider availability and actual client screenshots must be checked again when real content is added.
- The optional FAQ disclosure animation in `src/styles/globals.css` currently uses the reduced-motion query instead of no-preference. Global reduced-motion rules suppress its transitions, so native disclosure works but normal motion lacks this enhancement. This was identified during CTA verification and left for a focused motion fix.

## Initial scaffold validation (historical)

- Dependency installation succeeded; npm audit reported zero vulnerabilities at installation.
- Final production build, strict type checking, ESLint (zero warnings), Prettier check, and all four content/media tests passed on the cleaned source.
- HTTP checks returned 200 for home, work, category filters, robots, sitemap, and generated Open Graph image; draft and unknown routes returned 404 with no draft content exposed.
- In-app Chromium browser: checked widths 320, 390, 768, 1024, 1440, 1920, and 2560 px without document horizontal overflow. Visually inspected phone hero, work filters, desktop hero, and system diagram.
- Mobile disclosure opens/closes; Escape restores button focus. Native FAQ expands via keyboard. Server-rendered category links update selection and empty-state copy.
- A temporary, explicitly labeled local QA project exercised the actual case-study route, cover/gallery, confidential-client suppression, optional sections, and video transcript. Media elements were absent before activation; the native video loaded only afterward with controls and no autoplay. QA content and asset were removed afterward.
- The browser's real reduced-motion setting was on: no pin wrapper, normal-flow workflow diagram, and automatic (non-smooth) scrolling were verified. The full GSAP branch was separately checked with a temporary local media-query inversion, confirming pinning, staggered node assembly, and resolved conclusion; the original preference gate was restored afterward.
- No application warnings or errors appeared in the inspected browser logs. Third-party Loom/YouTube/Vimeo URLs were normalization-tested; actual client-provider playback awaits supplied recordings. No Safari/Firefox or formal WCAG audit was performed.
- An isolated configured-domain check also confirmed production sitemap URLs and robots crawl rules. Re-run the documented commands after content or code changes.

### Motion pass verification — 2026-09-24

- Lint, strict typecheck, all four content/media tests, and production build pass. Tests required execution outside the sandbox because Node user lookup failed inside it.
- Normal-motion branch reviewed in Chromium using temporary local media-query inversion because the available browser reports reduced motion and cannot emulate that preference. Inversion was removed before the final build. No OS preference was changed.
- Verified system assembly/hold/collapse/final statement, all five workflow states and complete connections, About/CTA end states, six process reveals, and project mask moving from inset 15% to fully revealed. Temporary card fixture was removed before build; no draft was published.
- Repeated resize checks at 390×844, 768×1024, 1366×768, 1920×1080, and 1440×900: no horizontal overflow, zero mobile pins and exactly two tablet/desktop pins. Work navigation removes pins; returning restores exactly two. No new browser errors after the refresh fix.
- Reduced-motion checks at widths 320, 390, 768, 1024, 1440, and 1920: no pins or overflow. Final restored source additionally verified all system nodes and workflow articles at full opacity. Native FAQ opens with Enter.
- Real project media still awaits approved content. This is manual Chromium verification, not automated cross-browser animation testing; Safari/Firefox and recording-based performance profiling remain untested.

### Section transitions and intensity — 2026-09-28

`animations/sectionTransitions.ts`, invoked inside the existing scoped `editorialTimeline`, owns boundary masks and outgoing/incoming composition. It adds no pins or scroll distance. The two signature timelines retain their existing pin distances. Inner timeline effects and outer boundary effects use separate elements/properties where possible; shared entry/exit clip paths have explicit endpoints and delayed initialization.

- Hero → Services: opposing title velocities and slight outlined-line scale; supporting copy masks at a different speed; services opens vertically with separate line masks.
- Services → System: last rows compress slightly, descriptions recede, separators extend, and black clips upward while the system heading enters.
- System → Work: a decorative white canvas grows from the bottom center only as the system releases. The secondary conclusion leaves while the selected-work title reveals. The canvas is hidden in static/mobile layout and is not project content.
- Work → Workflow: a drawn boundary rule precedes the masked workflow heading.
- Workflow → Websites: the completed diagram scales slightly and clips toward a frame; the next heading enters at a different rate. Browser media expands from 80% horizontal scale to full width, with slower inner movement and a restrained exit crop.
- Tools → About: toolkit groups move slightly apart while the black panel clips upward and three title lines enter. Selected DOTS characters briefly separate and return; the heading retains a full accessible name.
- About → FAQ: the black curtain contracts as About type exits and the FAQ heading reveals. Native disclosures retain their calm CSS transitions; height changes refresh downstream trigger geometry.
- FAQ → CTA: rules extend into the CTA boundary and words enter in two timed groups, followed by quiet supporting copy. The final composition stops moving.

System nodes now begin farther away with alternate initial scales; collapse exits left/up and right/down while connectors retract sequentially. Workflow state changes use opposing article masks and 20% heading translation instead of opacity crossfades, with slightly enlarged active black nodes. Process items advance, settle, and recede through short scrubbed sequences. Project media opens from a constrained mask/scale, metadata masks upward, and the title slides into alignment; keyboard focus still immediately completes the reveal.

Tuning: `lib/motion.ts` exposes desktop/tablet/mobile intensity multipliers 1/0.75/0.3 and an overlap offset of 0.18 timeline units. Boundary start/end positions generally span incoming top 95% to top 30% of the viewport. Compositions share the incoming trigger so outgoing motion starts while incoming content appears; the Work and Workflow reveals start 0.18 units before the preceding canvas/rule completes. Adjust individual masks/transforms in `sectionTransitions.ts`, rather than extending pins. Existing smoothing remains 0.65 seconds.

Mobile retains short masks, small inversion crops, normal-flow workflow copy, and modest project motion. Desktop parallax, row compression, letter dispersion, media exit crops, and process receding are omitted on mobile. Reduced motion skips the entire GSAP setup and preserves visible static content. No dependency, public project data, route, or SEO changes were needed.

Verification: watched the normal-motion Chromium preview from hero to footer and inspected all eight requested boundaries. Repeated responsive checks at 390×844, 768×1024, 1366×768, and 1920×1080 showed no horizontal overflow and respectively zero/two/two/two pins. Reduced-motion behavior was checked at 320, 768, and 1440 widths using a temporary query inversion because the browser currently reports no preference; it showed no pins, masks, or decorative canvas. Restored the production preference gates immediately afterward. A temporary local project fixture confirmed masked/scaled media and metadata return to fully visible; removed before build. No real project was published. Keyboard FAQ expansion passed. No cross-browser or formal frame-rate benchmark was performed.

Final checks for this pass: ESLint, strict typecheck, all four tests, formatting, and production build passed. The build required network access for the existing Google Fonts. Production preview on localhost:3000 reports normal motion, exactly two pins, no horizontal overflow, and no application console warnings/errors. Route navigation removes and restores pins without duplication.

### Content refinement pass

Refined homepage supporting copy while preserving every signature headline, animation wrapper/selector, timeline, CSS rule, route, and project architecture. Primary positioning remains GoHighLevel Automation Specialist & CRM Systems Builder in the page title/site configuration and searchable hero copy. Service names now read CRM setup & pipelines and APIs & integrations; the workflow description explicitly retains GoHighLevel workflow automation, lead routing, follow-up, and calendars. Metadata, structured data, FAQ questions, internal links, and project content are unchanged.

Website/funnel showcase: DESIGNED TO CONVERT. / WIRED TO THE CRM. The section headline THE FRONT END. / WITH A BACK END. remains. Process: THINK IT THROUGH. / BUILD IT RIGHT. The six step names remain unchanged. Hero/services/system supporting copy now distinguishes positioning, services, and the lead journey instead of repeating system/connected/click language.

About retains approximately two years of hands-on GoHighLevel experience, adds four years of Computer Science study as the foundation for logic, debugging, and practical problem-solving, and emphasizes testing handoffs and reliability. The existing signoff area now states: Computer Science Studies / AMA Computer Learning Center (ACLC) College of Butuan / 2020–2024. The degree was not completed. Never change this to an awarded degree, graduation claim, or certification without new verified information.

Edit revised section copy and education in src/data/homepage.ts, hero/contact/positioning in src/data/site.ts, and services/process descriptions in src/data/services.ts. Keep the component markup around text intact because motion selectors depend on it.

Validation: lint, strict typecheck, four content/media tests, and production build passed. Malformed generated .next/dev/types route files were removed and regenerated with next typegen; no source or TypeScript configuration workaround was used. Browser checked widths 320, 390, 768, 1440, and 1920 without document overflow; revised website/process headings fit, About study details remain readable in mobile flow, and the existing two desktop/tablet pins and zero mobile pins remain. Inspected browser logs were clear. No animation logic, responsive styles, SEO implementation, or public project records changed.

## Demo library and replacement

`src/data/demoProjects.ts` defines nine illustrative records, imported by `src/data/projects.ts`. Five are automation/CRM/integration concepts; four are websites/funnels. The three `featured` entries feed Proof of Work. `/work` uses all published entries and the existing category URL filters. `getProject` and static params expose only published entries; the original draft template remains inaccessible. Next Project follows published data order and loops back to the first entry. Its `#main` anchor brings the new case study into view.

`isDemo: true` visibly labels cards, previews and the case-study hero. Demo detail metadata always sets noindex, regardless of the production domain configuration. Demo pages emit no project JSON-LD, and `indexableProjects` excludes demos from the sitemap. The production domain remains unconfigured. Original HTML/CSS `DemoVisual` diagrams and page concepts require no image downloads. They are documentation, not functioning CRM screens or live websites. `ProjectWalkthrough` shows an explicit noninteractive media slot for demos; it delegates to the existing click-to-load `VideoPlayer` when actual video data exists.

To replace a demo, create a full `Project` entry in `src/data/projects.ts` using the hidden template and remove its corresponding seed from `demoProjects.ts`. Replace title, summary, challenge/problem, solution, objective if useful, tools, workflow steps and implementation notes with approved facts. Add local `coverImage`/`coverAlt`, optional `mobileImage`, and `gallery` entries with `src`, `alt`, and optional captions. Add `video: { provider: "loom", url: "<approved share URL>", title: "<descriptive title>", poster: "/projects/<slug>/poster.webp" }` and an optional transcript. Only use actual permitted live/repository links. Remove `demoVisual`, `demoVideoSlot`, demo descriptions and `demonstrates`; set `isDemo: false`, and use verified `results` or non-metric `deliverables`. Review optional `seo.title` and `seo.description`, links, accessibility and media before publishing. Configure the real domain only when ready. No layout changes are needed.

## Work grid and case-study rules

The existing `.wrap` max-width remains the outer boundary. `.featured-project-grid` and `.website-project-grid` share 12 columns and `--work-gutter` (20–36px). Featured cards occupy columns 1–6 and 7–12; the second starts three gutters lower. The third occupies columns 3–10. Websites alternate columns 1–10 and 3–12, retaining equal media widths, a 16:9 desktop preview canvas and aligned copy/metadata/CTAs beneath each frame. Vertical gaps use three gutter units. Adjust these `grid-column` declarations and gutter multiples in `src/styles/globals.css`, not arbitrary transforms or per-project copy. Tablet reduces the feature offset to one gutter and uses full-width website frames. Below 700px all work presentations use one column with no offsets. The archive keeps its restrained two-column/one-column grid.

The shared case-study route renders: concise hero → Challenge → Solution → optional desktop/mobile preview → Workflow & Architecture (Page to CRM for websites) → Video Walkthrough → optional supporting gallery → Implementation notes (Build details for websites) → outcome → links → Next Project. The video block immediately follows workflow when workflow data exists. Non-website cases now use the supplied horizontal timeline component documented below; website/funnel Page to CRM retains its existing layout. ProjectReveal, PageMotion and the shared reduced-motion gate remain in use.

`src/lib/projectContent.ts` merges unique challenge/problem, real-project context and objective into at most three paragraphs; demo overview copy already repeats the summary and is omitted. `challenge` can replace legacy `problem`. Keep Solution concise and implementation notes to 3–6 useful points. Outcome selection is explicit: demos use `demonstrates` and “What this demo demonstrates”; real entries with `results` use “Outcome”; otherwise `deliverables` use “What I delivered”. Absent arrays/media render no empty sections. Add or remove optional blocks through project data; do not create separate routes/templates per project type.

## Future real-project collection

Collect the project name/category, tools and actual role; one cover screenshot; 2–5 supporting screenshots; a workflow diagram and relevant pipeline/CRM screenshot; desktop/mobile website captures where applicable; a short challenge and solution; workflow steps; 3–6 implementation notes; actual outcomes or deliverables; and a permitted live link. Redact sensitive account/contact data and obtain approval for all claims/assets.

Aim for a 1–3 minute Loom: 0:00 what it does; 0:15 trigger/entry point; 0:30 main workflow; 0:50 pipeline/CRM logic; 1:10 integrations; 1:30 testing and edge cases; 1:50 outcome. Adapt timings to the project. Supply an optimized poster, captions/transcript, descriptive title and valid provider URL. The player reserves 16:9 space, loads the embed only after activation, and retains an external fallback link. Demo slots are not playable videos.

### Current validation

Lint, strict typecheck and seven content/media tests passed. Browser checks covered the homepage, archive and automation/integration/website case studies at 320, 390, 768, 1366, 1920 and 2560 widths (representative subsets per case): no horizontal document overflow. Confirmed three featured entries, four aligned website previews, nine archive entries, keyboard category filtering, demo noindex/no project schema, no inactive live links or embedded videos, and the draft template's 404. Workflow is followed directly by video. Mobile placeholder retains 16:9.

Normal motion retains two tablet/desktop pins and none on mobile. Reduced motion was exercised by temporarily inverting only the preference gates at 320, 768 and 1366 widths: no pins or masks, visible case text. Original gates were restored before the final build. Navigation testing found Next.js 16's smooth-scroll opt-in was missing; the documented `data-scroll-behavior="smooth"` on the root HTML now makes Next Project land at the intro while retaining in-page smooth scrolling. Final browser console had no errors. No supplied real recording exists, so live playback was not verified; provider normalization tests and the unchanged activation-only player cover the supported configuration path. No cross-browser or performance benchmark was run.

Final production build passed (17 generated routes/pages). Checked all nine generated demo HTML files: every one contains noindex metadata and none emits CreativeWork schema.

## Inside the Workflow — technical storytelling

Section 02 (`SystemStory`) keeps its black conceptual ecosystem and “ONE LEAD. EVERY NEXT STEP.” headline. Only its small label changed to SYSTEM OVERVIEW in `src/data/homepage.ts`. Section 04 (`WorkflowShowcase`) now uses “BEHIND EVERY LEAD. THERE’S A WORKFLOW.” and explains Trigger → Contact → CRM → Action → Decision → Follow Up → Complete. This is explicitly illustrative, not a deployed client workflow.

`src/data/workflow.ts` owns the reusable `WorkflowStep` / `WorkflowBranch` contract and seven demo steps. Each step has a stable unique `key`, state `label`, node `title` and concise `description`. Optional `actions` expand within a node; `branches` have a label, action and target step key. The appointment Yes branch moves to Booked and targets Complete. The No branch targets Follow Up, whose route label says NO BRANCH ONLY. Both paths resolve to an explicit CRM state; completion does not imply a sale. The branch test checks that targets exist and booked contacts bypass reminders.

`src/components/work/WorkflowVisualization.tsx` renders the semantic ordered timeline, branch text, diagram and duplicate decorative state typography. Descriptions and relationships remain available to assistive technology, including when visually clipped in cinematic mode. Connectors are decorative; branch labels and destination text carry their meaning. CSS uses existing monochrome tokens; no canvas, media downloads or dependency was added.

`src/components/animations/workflowTimeline.ts` uses the existing `useMotionScene` GSAP context and matchMedia cleanup. Desktop (at least 1100px wide and 720px tall) pins only the split layout, centered according to its measured height, for 4.2 viewport heights (`motion.workflowDistance.desktop`). Seven scrub segments draw connectors, activate nodes, expand Action details, reveal the appointment split, activate the No branch and resolve Complete. State words move vertically through masks; opacity supports the copy transition. Prior nodes remain readable, upcoming outlines are muted, and the final state exposes the full architecture. The existing Section 03/04 boundary and 04/05 media transition selectors are retained.

Tablet, mobile and short desktop viewports use normal document flow with a vertical diagram and all descriptions. Tablet no longer pins Section 04; Section 02 retains its existing independent tablet pin. With reduced motion, no workflow animation is initialized: the entire semantic diagram and both branches are static and readable. Do not hide base content in CSS to prepare animation. GSAP applies initial masks only after the motion preference/breakpoint gate allows it.

For later case studies, import `WorkflowVisualization`, pass an approved step array and an appropriate provenance `label`, and use `pinned={false}` for a normal-flow diagram. Use a React key such as the project slug if swapping datasets in an already-mounted client view. Keep keys unique and branch targets valid; ensure branch destination text describes bypass paths. This is a sequential workflow with optional decision branches, not a general-purpose graph editor. For larger custom flows, use static mode or verify pinned canvas fit before enabling pinning. No route, SEO or project model changes are required for this reuse.

Validation: lint, strict typecheck and all eight tests passed. Viewed every desktop state, the masked word transitions, drawing connectors, action expansion, Yes/No split, activated No branch and final Complete architecture. Checked 320×800, 390×844, 768×1024, 1100×720, 1366×768, 1920×1080 and 2560×1080: no horizontal overflow. The desktop canvas is 648px tall and centers within the tested viewport. Total homepage pins are two on desktop, one on tablet (Section 02), zero on mobile. Work navigation removes pins and returning restores the expected count without nested pin spacers. Browser logs were clear. Reduced motion was tested through temporary preference-gate inversion at 320, 768 and 1366 widths: zero pins, all nodes/descriptions/branches visible; original gates were restored afterward. No cross-browser or frame-rate benchmark was performed.

Section 04 final production build passed, including TypeScript and generation of all 17 routes/pages.

## Shared CTA system and verification

The final CTA rules and `--cta-*` tokens are in the shared CTA block at the end of `src/styles/globals.css`. Components retain semantic links for navigation and a real button for video activation. There is no separate CTA component or animation framework.

- Primary: `.button.button-dark`, near-black fill, white text, thin black border, square corners, minimum 52px height.
- Secondary: `.button`, white fill, black text and border, minimum 52px height.
- Project/utility: `.text-link`, transparent outlined rectangle, minimum 44px height. Archive filters use the same compact height and outlined treatment. `.project-cover-label` is a decorative VIEW badge inside the actual cover link, not a separate control.
- Tokens: standard/compact height 52/44px, horizontal padding 24/18px, shared action gap 14px, text 11px and tracking .08em. `.actions` wraps optional project links; footer links wrap too.
- `.cta-label` provides a restrained 2px hover shift. Primary hover inverts to white/black; secondary and utility invert to black/white. Active controls use charcoal/white. Focus uses a visible 2px outline with space around the control. Reduced motion disables transitions and label movement.
- Normal CTAs have text-only labels. Process connectors, ordered data-flow arrows and Yes/No branch arrows remain because they communicate logic. Noninteractive service/empty-state graphics are outside the CTA rule.
- Next Project is one full-width editorial link with the category label and large title. Hover warms the background and shifts the title 3px; keyboard focus outlines the entire link. Its `#main` destination lands at the next case-study intro.
- The video poster remains a semantic activation button with a styled span inside it, and loads media only after activation. The external fallback is a compact link. Missing demo recordings render noninteractive placeholders.

Verification on 2026-10-02: lint, strict typecheck, all eight existing tests and the production build passed (17 generated routes/pages). Tests ran outside the sandbox for the known Windows user-info lookup limitation. The first sandbox build could not download Google Fonts; the build with network permission passed. The existing dev server at port 3000 had fallback fonts from that same restriction; visual checks used the successful production build at port 3002 with the approved fonts. No dependency or font configuration was changed.

Chromium checks covered homepage hero/curated work/website utility controls, archive filters, automation and CRM case studies on mobile, and integration/website case studies on desktop, with representative widths 320, 390, 768, 1366, 1920 and 2560. The website case study had no horizontal overflow at all tested widths. Tested homepage/mobile/archive views also had no overflow. Primary/secondary hover inversion and 2px label shifts were observed; utility/filter/footer and Next Project hover/focus were inspected. Hero controls measured 52px; utility controls measured 44px; tablet filters exceeded 44px. Mobile hero wraps when necessary and case-study action links fit without clipped labels.

Native keyboard input verified category filtering, case-study links, Next Project and Back to Top. Next Project landed with the new main content 30px below the viewport top; Back to Top returned to the top. Space opens the mobile/tablet menu and Escape closes it and restores toggle focus. Homepage desktop system assembly and workflow Contact/Action/Follow Up/Complete states, expanded actions and appointment branching were reviewed during scroll. Resize checks retained two desktop pins, one tablet pin and zero mobile pins. Case-study navigation removed homepage pins; returning restored the expected count. No production console errors were observed. All nine generated demo pages contain noindex and omit CreativeWork schema.

Remaining limits: actual live/repository/contact links and playable video are unconfigured, so their safe conditional rendering, grouping and activation logic were reviewed in code; live destinations/playback were not exercised. The browser reports no-preference and exposes no reduced-motion emulation; reduced-motion gates were inspected without changing production queries or OS preferences. A fresh visual check under a real reduced-motion preference, Safari/Firefox checks and performance profiling remain pending. The FAQ preference-gate inconsistency above is a separate small motion issue; no CTA redesign or unrelated implementation change was made during this verification.

## Case-study Workflow & Architecture — supplied horizontal timeline

The current implementation replaces the earlier split architecture/detail effect with the actual supplied Hyperiux Vault `timeline.tsx` component as its base. `src/components/ui/timeline.tsx` retains the recognizable sticky viewport, wholeSlider horizontal xPercent translation, progressive journey-line, alternating top/bottom milestones, stem scaleY, dot scaling, and scrubbed SplitText line reveals. The image, dated product-history content and reference orange are removed. The old `ArchitectureMotion`, `architectureTimeline` and `projectArchitecture` files and their node-group mapping data were removed after the replacement worked. No new dependencies were installed.

`CaseArchitecture` remains a small Server Component in the shared non-website case-study route. It renders the existing workflow heading/provenance, the project's supplied demo headline when available, and the client Timeline. Website/funnel Page to CRM, Challenge/Solution, video, CTA, homepage scenes and SEO remain unchanged. The timeline uses the supplied composition rather than the homepage's cinematic workflow.

`projectTimeline` maps the existing `Project.workflowSteps` into serializable milestones: stable `id`, original `index`, two-digit `step`, `title`, optional `label`/`description`, and `position: top | bottom`. Positions alternate by default, with optional explicit position overrides on a workflow step. Duplicate step IDs are rejected. Every supplied detail remains a separate milestone; no high-level grouping is imposed. The illustrative Make integration has seven milestones: four above and three below the line, with descriptions supplied in the correction brief. Ten-step legacy workflows use the same component. Missing descriptions produce no empty copy or animation targets. For approved real work, populate workflowSteps in `src/data/projects.ts`; use approved titles, descriptions and optional stable IDs/positions. Animation state is never stored in project content.

The wholeSlider tween and journey-line draw across the section remain, with separate scrubbed stem/dot/icon timelines for each milestone. The source marker reveal windows [6,26] through [65,85] are generalized across the actual milestone count. Title/description reveals follow actual horizontal entry through containerAnimation, as documented below. The horizontal travel is measured from the track and viewport widths so the final milestone remains reachable for different workflow lengths. Sticky travel is contained within the section and releases into the unchanged Video Walkthrough; no GSAP pin spacer is added. SplitText uses word/line masks, avoiding unused character splitting; the source stem/dot/icon clock is preserved.

The existing `useMotionScene` owns GSAP context, plugin setup, refresh and the shared no-preference gate. An inner matchMedia handles horizontal layout at widths of at least 700px and heights of at least 560px. Width observation rebuilds the scene through context cleanup so SplitText line wrapping stays valid after resize. Cleanup reverts SplitText, tweens and ScrollTriggers, removes enhancement/state attributes and disconnects the observer. Selectors are scoped to the component.

Small screens and short viewports show a complete vertical ordered sequence in normal flow. Reduced motion follows the same readable static markup: the shared preference gate initializes no timeline scene, and base CSS has no sticky viewport, large scroll distance or hidden text. No competing preference hook or production query inversion was introduced. The animated top/bottom duplicate is decorative and aria-hidden; a logically ordered semantic list remains available to assistive technology on desktop and becomes the visible static/mobile presentation.

The single central `--color-accent: #c65a24` token supplies the progressive horizontal line, active stems/dots and a tiny current marker. Completed stems/dots return to black; the main line retains the source's copper progress treatment. State labels also say NEXT/CURRENT/DONE. Typography, backgrounds, headings and CTAs remain monochrome. Copper occupies only thin lines/tiny markers, well below the brief's approximate 5% ceiling. Do not apply it to large headings, filled cards, buttons, all links or backgrounds, or introduce bright reference orange, gradients or multiple accents.

Validation on 2026-10-02: lint, strict typecheck, all ten tests and production build passed (17 generated routes/pages). Tests cover all published workflow steps, alternating positions, seven integration milestones/descriptions, explicit positions, empty workflows and duplicate IDs. Visually confirmed the supplied interaction on desktop: sticky viewport, whole-track translation, growing central line, opposite stem origins, dot activation, masked titles/descriptions and final readable confirmation before release. Production checks at 375×844, 768×1024, 1024×768 and 1440×900 found no horizontal body overflow; mobile is static and tablet retains horizontal motion. Resize and short-viewport checks reverted masks/state attributes and restored one fresh timeline. Client navigation to Next Project removed the timeline, preserved website Page to CRM and landed main at 30px; returning home restored the two existing pins. A ten-step legacy case rendered all milestones, with no inspected production console warnings/errors. Reduced-motion gating and static markup were checked in code; an actual reduced-motion visual check remains pending because the available browser reports no-preference and exposes no emulation capability. No formal performance or cross-browser benchmark was performed.

### Milestone content polish

Workflow milestones now accept an optional `icon` key alongside their existing title, description and label. `projectTimeline` preserves this metadata and defaults to a neutral workflow symbol when an icon is absent. `WorkflowIcon` follows the existing inline SVG convention: decorative 22px, 1.5px stroke, no fill, consistent caps/joins, aria-hidden and unfocusable. No icon library was installed. Available keys are workflow, trigger, webhook, json, mapping, integration, validation and database.

The five non-website demo workflows supply symbols and concise descriptions centrally in `src/data/demoProjects.ts`, based on their existing illustrative sequences. Future real workflows should supply approved descriptions and appropriate icon keys in workflowSteps; the component contains no demo-copy lookup or title-based inference. Website Page to CRM is unchanged.

The hierarchy is step/status → small icon → strong title → smaller muted description. Active icons use the central burnt copper token, completed icons use ink and upcoming icons use muted gray; stems/dots use the corresponding active/completed/upcoming colors. The icon's restrained 8px/opacity reveal overlaps the existing item timeline at time zero, so it adds no scroll trigger or duration. Horizontal travel, sticky viewport, track dimensions, alternating positions, line progression and scroll windows remain unchanged. Descriptions use 13px desktop/12px tablet type with compact spacing; the existing mobile/static list shows complete readable icons and copy.

Validation: lint, strict typecheck, ten tests and production build passed. Production review at 1440×900 confirmed icon/state coloring and the existing scroll interaction. At 768×1024 and 375×844, all five workflow cases had descriptions of at most two lines, with no truncation or horizontal overflow. The integration case also passed 1024×768. Three phrases were shortened after tablet wrapping checks. Icons remain decorative and the logical semantic list carries the full meaning. Existing reduced-motion handling remains unchanged; its prior actual-preference visual verification limitation still applies.

### Earlier milestone text timing

Only the title/description reveal timing changed in `src/components/ui/timeline.tsx`. The initial timing adjustment still used section-percentage windows, which drifted relative to horizontal entry on the ten-step Lead Follow-Up workflow: its current contact milestone could pass the readable area before copy appeared. Copy now has a scoped ScrollTrigger using the existing horizontal timeline as containerAnimation. It reveals from `left 90%` to `left 65%`, becoming complete before the milestone reaches the center and staying visible through its remaining travel.

Both copy targets use a 22px masked upward movement, subtle opacity and 0.01-second line stagger. The title starts immediately; the description follows at 0.03 × normalized duration, with brief overlapping reveals. An inert hold tween preserves the original marker activation duration, including its prior line-count allowance. Stem/dot growth stays at 0.4 × duration through 0.8 × duration. Horizontal travel, marker ScrollTrigger windows, icon timing, layout and responsive rules are unchanged; the new copy triggers share the existing scoped cleanup and resize rebuilding.

Correction validation: lint, strict typecheck, all ten tests and production build passed. Production checks placed every milestone of the ten-step Lead Follow-Up workflow at its center/readable position at 1024×768, 1440×900, 1920×920 and 768×1024. Every title/description line had full opacity and zero translation, including the first/final reachable positions. Reproduced the user's second-milestone CURRENT position at large desktop width and confirmed complete copy. Mobile 375×844 retained all ten readable static steps, no masks or enhancement attributes. No horizontal body overflow or inspected production console warnings/errors; resize cleanup restored the static mobile view. Actual reduced-motion and cross-browser visual checks remain pending as previously documented.

## Global smooth scrolling

`src/components/layout/SmoothScroll.tsx` mounts once in the persistent root layout and owns one Lenis 1.3.26 instance. Global tuning lives in `src/lib/smoothScroll.ts`: wheel lerp 0.18, multiplier 1, syncTouch false, autoRaf false. It scrolls the native window without transformed wrappers or scrollerProxy, preserving existing sticky/pinned geometry and all section/timeline timing. No design, timeline or scene changes were needed. Integration follows the [Lenis GSAP guidance](https://github.com/darkroomengineering/lenis): the existing GSAP ticker calls raf with milliseconds, Lenis scroll events call ScrollTrigger.update, and ticker lag smoothing is disabled globally. There is no second animation loop or new refresh loop; existing useMotionScene refresh ownership stays unchanged.

The shared `motion.allowed` query owns reduced-motion behavior through GSAP matchMedia. Lenis only initializes with no-preference and a fine, hover-capable pointer; a preference/device change destroys the instance and ticker subscription. Lenis's own preference behavior is disabled because this shared gate owns it. Coarse-pointer devices use native scrolling; touch remains native even on hybrid devices, because syncTouch is false. Narrow mouse-driven desktop windows can still use wheel smoothing. Existing reduced-motion CSS makes native anchor scrolling immediate.

Anchors remain browser/Next.js owned with the existing CSS smooth behavior and 30px scroll padding. Header is in normal flow, so no new fixed-header offset is necessary. Lenis anchors are disabled to avoid competing with Next hash navigation, focus and browser history. Wheel momentum is canceled before links, scroll keys, Tab/focus changes and history restoration without preventing default behavior. Route changes resize/synchronize Lenis to Next's chosen position instead of forcing top. Native nested scroll containers and form/dialog controls bypass wheel smoothing; data-lenis-prevent remains available for future overlays. Cleanup removes listeners, ticker callback, scroll subscription and Lenis classes/observers.

Validation: lint, strict typecheck, all ten tests and production build passed (17 routes/pages). Production Chromium review used wheel input through Hero, System Overview, Proof of Work and the pinned Inside the Workflow decision scene. The seven- and ten-step architecture timelines retained track movement, line/marker states, early full-opacity copy and reachable final milestones. Next Project landed main at 30px; Back to Top returned to zero; Services landed at 30px and hash/history restoration remained native. Home/End, Page Up/Down, Space and Tab worked; mobile menu Space/Escape retained focus behavior. Width checks at 320, 375, 768, 1024, 1440 and 1920 found no horizontal body overflow and expected homepage pin counts (0 mobile, 1 tablet, 2 desktop); navigation removed homepage pins. Timeline mobile resize reverted masks and retained complete static content. No inspected console errors/warnings.

Limits: browser viewport tests retain a desktop fine pointer and cannot emulate reduced motion or physical touch/trackpad gestures. Native touch/coarse-pointer and live reduced-motion cleanup were reviewed in implementation but require real-device/preference checks. No Safari/Firefox or frame-rate benchmark was performed. Existing unrelated FAQ preference-gate limitation remains as previously recorded.

## Final checkpoint — 2026-10-02

Complete: the supplied case-study horizontal interaction, alternating milestones, technical icons, short project-data descriptions, earlier copy reveal, copper active states, shared CTA verification and global smooth scrolling. The current reference motion is approved; the overall design is not final. This checkpoint changed documentation only, corrected stale stack/current-state notes, and preserved all working source. No new implementation regression was found.

Resume map:

- `src/components/work/CaseArchitecture.tsx` is the Server Component wrapper used by non-website cases in `src/app/work/[slug]/page.tsx`. Website/funnel Page to CRM remains separate.
- `src/components/ui/timeline.tsx` owns the supplied sticky horizontal viewport, wholeSlider travel, progressive line and alternating top/bottom items. Its pinned appearance uses CSS sticky, not a new GSAP pin spacer. `src/components/ui/WorkflowIcon.tsx` renders decorative 22px technical SVGs.
- Populate `Project.workflowSteps` in `src/data/projects.ts` for approved real work. Current demo sequences, descriptions and icon keys are in `src/data/demoProjects.ts`; `src/lib/projectTimeline.ts` maps stable IDs, step numbers, titles, optional labels/descriptions/icons and alternating or supplied positions. Keep demos explicitly illustrative and drafts inaccessible.
- `--color-accent: #c65a24` in `src/styles/globals.css` applies only to the thin progress line and active icons/stems/dots/current marker. Completed items use ink; upcoming items use muted/light gray. Keep large surfaces, headings and CTAs monochrome, and retain textual state labels.
- Marker/icon windows and activation clocks remain unchanged. Copy alone follows the horizontal containerAnimation from `left 90%` to `left 65%`, with the 22px masked reveal and minimal stagger. Do not revert to section-percentage copy windows: they caused the longer-workflow readability regression.
- `src/components/layout/SmoothScroll.tsx` and `src/lib/smoothScroll.ts` own the one root Lenis instance and 0.18 wheel lerp. Use the GSAP ticker plus ScrollTrigger.update; retain native window geometry, anchors/history, keyboard controls and touch. Do not add a second RAF loop, scrollerProxy, Lenis instance or refresh owner.
- Shared `motion.allowed` disables timeline setup and Lenis under reduced motion. Timeline widths below 700px or heights below 560px use complete static content. Scoped matchMedia, SplitText reversion, ResizeObserver and ticker/listener cleanup must remain intact.

Fresh checkpoint validation: `npm run lint`, `npm run typecheck`, `npm test` (10/10) and `npm run build` (17 generated routes/pages) passed. Tests/build used the previously documented Windows sandbox/network allowances. The existing Next warning about ignoring the parent-directory package-lock is informational; repository configuration was not changed. Fresh production Chromium checks at 1440×900 confirmed seven-step alternating content, copper states, sticky track, first/middle/final readable copy and Lenis presence. The ten-step contact milestone remained fully readable before center. At 375×844, all ten static steps remained available, enhancement/masks reverted and there was no body overflow. Inspected logs were clear. Earlier same-day six-width and navigation checks are recorded above.

Intentionally unfinished: design exploration below; approved real project facts/assets/results; configured contact/social/domain and launch inputs; supplied video media/captions/transcripts; physical trackpad/touch and live reduced-motion preference testing; Safari/Firefox and performance/accessibility audits. The older optional FAQ disclosure preference-gate issue remains documented for a focused fix; it does not block native disclosure. None of these were implemented or claimed complete today.

Git checkpoint: existing branch `main`, origin `https://github.com/Josri-Ocana/GHL-Portfolio.git`, base commit `e36744d` (Initial portfolio commit). Today's legitimate source/documentation changes, including all six new source files, are packaged in one commit named `feat: refine portfolio workflow interactions and motion`, with delivery to `origin main` by normal push. Before Monday edits, run `git status`, `git log -1` and `git fetch origin`, and confirm HEAD matches origin/main. Preserve this checkpoint while experimenting; do not force push, rewrite history or reset working changes. No Vercel configuration or deployment verification is included. Use `npm run dev` for local work; `npm run start -- --port 3002` serves the validated production build when running.

Pre-commit security review: only the 19 intended source, documentation, test and dependency-manifest files are candidates. No actual environment files, secret-pattern matches, generated build directories, credentials or unnecessary local files were found among them. Existing ignore rules are retained; the previously tracked `.env.example` contains only an empty public-domain placeholder and is unchanged. Final lint/typecheck, ten tests and production build were rerun before commit/push. No design or implementation changes were needed during the checkpoint.

## MONDAY DESIGN RESUME

The design is **NOT final**. Resume design work on Monday, 2026-10-05. Preserve the successful layout, content architecture, CTA controls, accessibility, responsive/static alternatives, approved timeline motion and earlier copy timing while experimenting. Make one focused experiment at a time and verify it before replacing any working implementation.

Remaining exploration areas, not implemented by this checkpoint:

- Additional section transitions.
- Typography animation experiments.
- Project-card interactions.
- Case-study visual components.
- Media presentation.
- Possible 21st.dev component experiments.
- Navigation interaction polish.
- Other animation references still to be selected.

Recommended first step: read this resume section and inspect Git status/diff, then review the current homepage and a seven-/ten-step case study as the baseline before selecting one additional section-transition reference. Choose the specific reference and scope before changing implementation; do not restart or redesign the successful timeline.
