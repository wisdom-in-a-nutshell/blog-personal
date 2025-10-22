# Repository Guidelines

This repo powers the personal blog built with Next.js App Router, TypeScript, Tailwind, and MDX content from `content/`. Read this overview at the start of a session, then open the linked guides before you touch the matching area of the codebase.

## Workflow Snapshot
- `pnpm install` on first run; `pnpm dev` for local preview.
- Run `pnpm lint` and `pnpm check` (if configured) before pushing sweeping changes.
- Keep copy tweaks and code changes in separate commits; posts live in `content/*.mdx`, structural work happens in `app/`.

## Reference Library
- Writing or editing posts? Follow `docs/rules/blog-creation.md` for MDX frontmatter, embeds, and publish workflow.
- Drafting long-form content? Re-read `docs/rules/personal-writing-style.md` so tone, pacing, and anecdotes stay on brand.
- Creating a new page or route under `app/`? Mirror the structure in `docs/rules/page-creation-guide.md`.
- Building components or deciding between server/client variants? Check `docs/rules/component-creation.md`.
- Choosing a data-loading strategy? Review `docs/rules/data-fetching-patterns.md` for App Router best practices.
- Touching shared utilities or naming? Keep `docs/rules/coding-conventions.md` handy for file naming and import order.
- Managing dependencies or scripts? Use `docs/rules/package-management.md`; stick to pnpm conventions.

## Updating Guidance
- When patterns change, update the relevant markdown file under `docs/rules/` and adjust this index.
- Once the team is ready to retire the legacy Cursor rules, remove the old `.cursor` entries after confirming every instruction lives in these markdown guides.
