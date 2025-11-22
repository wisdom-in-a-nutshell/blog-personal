# Company Posts — Agent Playbook

This playbook is for agents (and future you) who turn raw data into company-specific blog posts that follow the established style and component patterns.

## Scope
- You receive: a short brief + raw numbers (JSON/TS object preferred) and any charts requested.
- You deliver: a complete MDX post, linked charts and tables, and cross-links to related posts.

## Writing Style & Voice
- Always follow the canonical voice at `/Users/adi/GitHub/adi-brand/adis_writing_style.md`; apply blog-specific tweaks in `docs/rules/writing-style-blog.md`.
- For AIPodcasting context (positioning, terminology), skim `/Users/adi/GitHub/adi-brand/company-profile.md`.
- Keep the intro → key findings → visuals → methodology → next steps spine (see the last two posts for examples).

## Data Source of Truth
- Put display data in small, typed TS modules under `data/<topic>/`. Do not hardcode numbers inside charts and MDX.
- For cadence and duration posts, reuse:
  - `data/podcasts/cadence.ts` (counts and total)
  - `data/podcasts/episode-length.ts` (bucket counts per group)
- If a new analysis adds dimensions/metrics, create a new module under `data/<topic>/` with `as const` typed objects.

## Components to Use
- Charts: wrap with `ChartCard` (`app/components/charts/chart-card.tsx`).
- Existing charts you can drop into MDX:
  - Cadence donut: `PublishCadenceChart`
  - Episode-length bars: `EpisodeLengthHistogram`, `DailyEpisodeLengthChart`, `NearDailyEpisodeLengthChart`, `WeeklyEpisodeLengthChart`, `MonthlyEpisodeLengthChart`
- Tables (data-driven):
  - `CadenceSummaryTable` (uses `data/podcasts/cadence.ts`)
  - `EpisodeLengthTable group="overall|daily|nearDaily|weekly|monthly|other"` (uses `data/podcasts/episode-length.ts`)

## Post Assembly (Checklist)
1) Create/verify data module(s) in `data/<topic>/`.
2) If needed, add or adapt a small chart component under `app/components/blog/<slug>/charts.tsx` using `ChartCard`.
3) Author the MDX file in `content/<slug>.mdx`:
   - Frontmatter: `title`, `publishedAt`, `summary`, `tags`, `image`, `hidden`.
   - Visibility: default `hidden: false` for all posts. Only set `hidden: true` if explicitly drafting privately.
   - Structure: intro → key findings (hero table ok) → charts/tables → methodology → what’s next.
   - Under each chart, include a companion data table using the shared table components (e.g., `<ReleaseWeekdayTable />`, `<ReleaseStabilityTable />`, `<CadenceSummaryTable />`, `<EpisodeLengthTable />`). No hardcoded numbers.
4) Cross-link the most relevant prior posts (the last two cadence/duration posts) when context helps.
5) Run locally: `pnpm dev` and scan visuals.
6) Commit: pre-commit will run Ultracite. Fix any lints.

## Data Formats
- Prefer TS modules (`as const`) with clear types. Example:

```ts
export const METRIC = {
  labelA: 123,
  labelB: 456,
} as const
```

- If you must start from JSON, paste into a TS file and add types. Avoid CSV.

## Linking & Assets
- Place images under `public/blog/<slug>/`. Reference with absolute path `/blog/<slug>/header.png`.
- Use consistent captions with `Caption` if needed.

## Quality Gates
- Run `pnpm dlx ultracite check` locally on bigger refactors.
- Keep charts/tables in sync with the single data module; avoid duplicate numeric literals in MDX.

## Small FAQ
- “I have new buckets/labels”: update the data module and the table/chart helpers for labels in one place.
- “My chart needs a different layout”: create a focused chart file under the post folder and still wrap with `ChartCard`.
