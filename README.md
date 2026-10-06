# Josri Ocaña — Portfolio

A monochrome, editorial portfolio for a GoHighLevel Automation Specialist & CRM Systems Builder. Built with Next.js App Router, React, strict TypeScript, Tailwind CSS, and GSAP. Real project content lives separately from presentation.

## Run locally

Prerequisite: Node.js 22 LTS or later, npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the final public origin when known.

## Validate and build

Use the smallest relevant check for each change:

| Command                   | Purpose                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `npm run verify`          | Quick default: ESLint, strict TypeScript and existing Node/tsx unit tests.          |
| `npm run test:e2e`        | Chromium route/navigation, browser Back, mobile menu and body-overflow smoke tests. |
| `npm run test:a11y`       | axe WCAG A/AA smoke checks on home, work and one case study, with reduced motion.   |
| `npm run check:dead-code` | Knip analysis; review findings before removing anything.                            |
| `npm run build`           | Production compilation and static route generation.                                 |
| `npm audit`               | Dependency advisories; do not use forced fixes.                                     |

After `npm ci`, install the browser once with `npx playwright install chromium` (Linux CI may need `npx playwright install --with-deps chromium`). Browser commands automatically build and start production on port 3100; they can reuse a current production server there outside CI. Do not run both browser commands concurrently because they share that server/build and report directories. Reports and failure traces go to ignored `playwright-report/` and `test-results/`; inspect with `npx playwright show-report`. The existing dev server on port 3000 is independent.

Automated accessibility checks do not replace keyboard, screen-reader, physical touch or visual motion review. Knip uses its Next.js/Playwright/config plugins plus explicit Node-test entry points and TypeScript aliases. Findings are review signals, not an automatic deletion list.

On Windows, `check:dead-code` preloads a small script that disables Oxc's experimental raw-transfer parser mode, which intermittently fails buffer allocation on this host. It uses Knip's standard parser without changing analysis coverage. Known findings and the current accessibility baseline are recorded in `HANDOFF.md`; Knip intentionally returns nonzero while findings remain.

Individual checks remain available:

```sh
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
npm start
```

The first build needs network access for Google Fonts. Next.js downloads and self-hosts Barlow Condensed and Manrope; visitors do not contact Google Fonts.

Use `npm run format` to format source and documentation consistently.

## Content and launch

- Set the verified email and social URLs in `src/data/site.ts`.
- Copy the unpublished entry in `src/data/projects.ts`, replace its content with verified work, add assets under `public/projects/<slug>/`, and set `published: true`.
- Unpublished projects return 404. The current library contains nine explicitly labeled demo concepts; replace them with approved real work using the guidance in `HANDOFF.md`. Demo case studies remain noindex and excluded from project schema and sitemap entries.
- Set `NEXT_PUBLIC_SITE_URL=https://your-real-domain` before production build. Without it, indexing is disabled and the sitemap is empty; localhost is used only as a development metadata fallback.
- Push to a GitHub repository and import into Vercel using its Next.js preset. Add the environment variable, then deploy. No custom server or Vercel configuration is needed.
- Confirm contact links, project permissions, canonical URLs, and video captions/transcripts before launch.

See `HANDOFF.md` for editing and maintenance guidance and `PROJECT_BRIEF.md` for the design intent. No domain, contact address, client work, or results have been invented.
