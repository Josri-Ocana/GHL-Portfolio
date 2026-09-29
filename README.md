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
- Unpublished projects return 404. The live library intentionally starts empty.
- Set `NEXT_PUBLIC_SITE_URL=https://your-real-domain` before production build. Without it, indexing is disabled and the sitemap is empty; localhost is used only as a development metadata fallback.
- Push to a GitHub repository and import into Vercel using its Next.js preset. Add the environment variable, then deploy. No custom server or Vercel configuration is needed.
- Confirm contact links, project permissions, canonical URLs, and video captions/transcripts before launch.

See `HANDOFF.md` for editing and maintenance guidance and `PROJECT_BRIEF.md` for the design intent. No domain, contact address, client work, or results have been invented.
