# Technical handoff

## Current state

Section 04 technical storytelling rework complete (2026-09-29). Section 02 is the conceptual System Overview; Section 04 is a seven-state automation with appointment branching. The workflow implementation and validation below supersede earlier five-stage workflow notes.

Work Grid & Case Study UX Refinement complete (2026-09-29), including nine explicitly labeled demo records. Current work presentation and replacement guidance are documented below. No demo represents client work or measured results.

Transition and intensity pass complete (2026-09-28), extending the verified 2026-09-24 motion pass. The approved layout, monochrome design, content, routes, and SEO are preserved. The two signature scenes now have complete scroll-driven timelines; supporting sections have restrained reveals. No dependencies were added. This workspace has no Git repository, so Git status/diff are unavailable.

Initial implementation in an originally empty workspace. Homepage, work library, dynamic case study route, reusable media, metadata, sitemap, robots, and structured data are implemented. No real project data, confirmed email, social URLs, or production domain were supplied. These are intentionally unconfigured. Nothing has been pushed or deployed.

Validation results are recorded below. Do not publish the template as a real case study.

## Stack and structure

Next.js App Router; React; strict TypeScript; Tailwind CSS through PostCSS; GSAP/ScrollTrigger. No WebGL, competing animation libraries, Lenis, database, CMS, contact backend, or secret credentials. Server Components are the default.

- `src/app`: home, work index, case studies, 404, layout, sitemap, robots, icon, generated Open Graph image.
- `src/data`: site identity/contact/hero, navigation, services/process, skills, FAQs, projects, metadata helper.
- `src/types/project.ts`: typed content contract and category list.
- `src/components/sections`: independently editable home sections.
- `src/components/layout`: responsive navigation and footer.
- `src/components/work`: cards and empty state.
- `src/components/media`: click-to-load walkthrough player.
- `src/components/animations`: scoped page entrance/reveal logic.
- `src/components/seo`: safely serialized JSON-LD.
- `src/lib/media.ts`: URL validation and provider normalization.
- `src/styles/globals.css`: shared tokens, editorial components, responsive and reduced-motion rules.
- `tests/content.test.ts`: draft visibility, slug integrity, and provider URL tests.

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
- `WorkflowShowcase` delegates to `animations/workflowTimeline.ts`: pins the diagram/copy composition, transitions CAPTURE through CONVERT, draws cumulative connections, and retains the completed path at the end. All five articles remain in the semantic document; only the enhanced visual composition overlaps them.
- `PageMotion` delegates to `animations/editorialTimeline.ts`: masked hero entrance and scrubbed exit, divider drawing, calm services, browser-frame expansion, six process reveals, skill dividers, About panel/line masks, and staggered CTA words.
- `ProjectReveal` wraps server-rendered project cards with media masks and copy stagger. Focus completes the reveal immediately for keyboard access. Native FAQ disclosure transitions use CSS feature detection with native fallback.

Tune shared easing, reveal/stagger duration, scrub smoothing, breakpoints, and pin distances in `src/lib/motion.ts`; stage timing and labels live in the two timeline modules. Desktop is at least 1100px wide and 720px tall: system pins for 3.6 viewport heights, workflow for 3. Tablet (700–1099px wide, at least 720px tall) uses 2.5 and 2.1 respectively. The system also checks that its content fits before pinning. Mobile and short viewports use normal flow and progressive reveals. Native scrolling is retained.

Reduced motion disables all GSAP setup, scrub, and pins; nodes, connections, and all workflow copy remain readable in static flow. CSS removes smooth scrolling and motion transitions. No preference override or test route remains in the source.

One-shot reveals use `toggleActions: "play none none none"`, retaining their triggers until context cleanup. Using `once: true` caused a GSAP refresh iteration error after completed triggers removed themselves during breakpoint recreation; repeat resize/navigation checks passed after this correction.

## Accessibility and responsiveness

Semantic sections, one h1 per page, native FAQ disclosures, focus styles, skip link, actual navigation links/buttons, no hover-only actions. Mobile navigation is a disclosure (not a modal), closes on selection, Escape, outside click, focus departure, or desktop resize. Escape restores focus to the toggle. Responsive filters wrap; no horizontal carousel is required. Illustrative diagrams are clearly labeled; the duplicated sticky workflow diagram is decorative to assistive technology.

## SEO, AEO, GEO

Unique page titles/descriptions, canonical URLs, Open Graph and Twitter image metadata, generated social image, semantic server-rendered content, project breadcrumbs, and truthful Person/WebSite/ProfilePage/CreativeWork/BreadcrumbList JSON-LD. FAQs are direct visible answers; no promises of rich results or search rankings. No fabricated ratings, employers, or metrics.

`NEXT_PUBLIC_SITE_URL` is the only environment variable. Set a final HTTP(S) origin at build time. When absent, metadata falls back to localhost, robots blocks crawling, and the sitemap is empty. This prevents accidental indexing of an unconfigured installation. Production should use HTTPS. No secrets are exposed or required.

## Deployment and maintenance

Use Node.js 22+ and `npm ci`. Run lint, typecheck, tests, then build. Deploy the repository to Vercel with the Next.js preset and the site URL variable. Fonts are downloaded at build time and self-hosted. Package versions are locked in `package-lock.json`. Basic security headers are configured; a restrictive CSP is not imposed because future approved third-party media hosts vary.

No Git repository or remote existed initially. Initialize/push when the user supplies a destination. Do not infer a GitHub account, domain, email, or client data. No backend contact form is presented: the verified mailto CTA appears only when configured.

Future changes should be local. Preserve unrelated sections, update this document when architecture changes, and verify replacements before removing old code or documentation.

## Known limitations and launch inputs

- Real case studies, screenshots, recordings, captions/transcripts, and results await supply.
- Confirm the correct email, social URLs, and public domain before launch.
- Current diagrams explain an illustrative process; they are not claimed as client work.
- No analytics, consent banner, contact submission service, CMS, or visual admin is installed.
- Video provider availability and actual client screenshots must be checked again when real content is added.

## Validation

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

The shared case-study route renders: concise hero → Challenge → Solution → optional desktop/mobile preview → Workflow & Architecture (Page to CRM for websites) → Video Walkthrough → optional supporting gallery → Implementation notes (Build details for websites) → outcome → links → Next Project. The video block immediately follows workflow when workflow data exists. Diagrams retain numbered text equivalents and a vertically connected detailed sequence. No new pins or animation system were introduced: existing ProjectReveal, PageMotion and reduced-motion gates remain in use.

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
