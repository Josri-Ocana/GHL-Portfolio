<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Portfolio maintenance

- Read `HANDOFF.md` before making architectural changes; update it to reflect the final implementation.
- Keep verified content in `src/data`; publish only supplied, approved project facts. Drafts must stay inaccessible publicly.
- Never guess contact details, social accounts, clients, metrics, or a domain.
- Preserve the monochrome tokens, readable typography, semantic controls, mobile layouts, and reduced-motion alternatives.
- Default to Server Components; scope and clean up GSAP effects. Lazy-load video after user activation.
- Keep changes local to the requested feature. Verify replacements before deleting earlier code or documentation.
- Use `SECURITY.md` when changing forms, APIs, external integrations, dependencies, headers or deployment.
- Run lint, typecheck, tests, and production build for meaningful implementation changes.
