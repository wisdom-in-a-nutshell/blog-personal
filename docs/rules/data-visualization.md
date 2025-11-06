# Data Visualization Playbook

Use this guide whenever you add or update charts in the blog. It keeps presentation, download behaviour, and data references consistent across posts.

## Core Pattern
- Wrap every full-width chart in `ChartCard` from `@/components/charts/chart-card`. It already handles the title, optional description, download button, and watermark signature.
- Provide the chart body as `children`. Drop legends or supplemental content into the optional `footer` slot.
- Pass `downloadName` (slugified title) so readers can export the PNG. Leave it empty only for charts that should not be downloadable.
- Use the shared signature: `signature="Adithyan Ilangovan | adithyan.io"` unless a post calls for an alternate credit. Remove it by setting `signature={null}`.
- Watermark placement defaults to inline (below the chart). You no longer need to set `watermarkVariant`; omit it unless you explicitly want `"overlay"`.

## Companion Tables (Required)
- Every chart must be followed by a raw, copy‑pastable table sourced from the exact same data module. This supports reuse on platforms that don’t render images or embeds.
- Tables live as typed React components under `app/components/blog/<slug>/tables.tsx` or shared ones under `app/components/blog/data-tables.tsx`.
- The table and chart must import from the single source of truth in `data/<topic>/` (no duplicate literals). Keep totals and percentage precision in sync.

### Example pattern
```tsx
// charts.tsx
export function ExampleChart() { /* ... */ }

// tables.tsx
export function ExampleTable() { /* render the same dataset as rows */ }
```

Then in MDX:
```mdx
<ExampleChart />
<ExampleTable />
```

### Quick Example
```tsx
<ChartCard
  title="Example Distribution"
  description="Distribution across podcast cadence buckets."
  downloadName="example-distribution"
  signature="Adithyan Ilangovan | adithyan.io"
  watermarkVariant="inline"
  footer={<Legend />}
>
  <ChartContainer config={chartConfig} className="h-[360px] w-full">
    {/* Chart implementation */}
  </ChartContainer>
</ChartCard>
```

## Data Source & Synchronisation
- Store bucket counts in dedicated data objects/modules. Avoid hard-coding inside both chart and MDX files; import the shared constants instead.
- When numbers change, update the data module first, then regenerate or re-check any derived values (shares, ranges).
- If the analysis includes MDX tables, render them from the same data source to prevent drift (e.g., map over the shared dataset).

## Layout Standards
- Set chart height/width via `ChartContainer` to maintain responsive behaviour—`h-[360px]` and `max-w-[420px]` are the current defaults.
- Use the existing colour palette: derive colours via `hsl(var(--chart-n))` so themes stay consistent.
- For legends, follow the cadence chart pattern (`text-xs`, small colour swatch, percentage). Place them in the `footer` to keep spacing uniform.

## QA Checklist
- Verify totals line up between chart, legend, and prose (e.g., cadence sums to 1,000).
- Confirm download output: run the download button locally and inspect the exported PNG.
- Ensure the watermark is legible on dark/light modes; adjust `watermarkVariant` if the chart body is too busy.
- Double-check accessibility: tooltip copy should describe what’s being hovered; axis labels must remain readable at mobile breakpoints.
- Validate that the companion table renders the same totals/percentages as the chart.

## Cross-Referencing Company Context
- If the chart supports an AIPodcasting story, pull positioning notes from `docs/company/aipodcasting-positioning.md`, but keep tone aligned with `.cursor/rules/personal-writing-style.md`.

Update this playbook whenever the shared chart wrapper or visual style changes so every future post can slot new data visualizations in quickly.
