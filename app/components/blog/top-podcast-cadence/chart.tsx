"use client"

import { Cell, Pie, PieChart, type TooltipProps } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"

const BASE_TOTAL = 1_000
const cadenceData = [
  {
    id: "daily",
    bucket: "Daily",
    shows: 185,
  },
  {
    id: "nearDaily",
    bucket: "≤3 days",
    shows: 135,
  },
  {
    id: "weekly",
    bucket: "Weekly (3–9 days)",
    shows: 582,
  },
  {
    id: "monthly",
    bucket: "Monthly (10–29 days)",
    shows: 83,
  },
  {
    id: "slow",
    bucket: ">30 days",
    shows: 15,
  },
] as const

const chartSegments = cadenceData.map((segment, index) => ({
  ...segment,
  share: Number(((segment.shows / BASE_TOTAL) * 100).toFixed(1)),
  colorVar: `var(--chart-${index + 1})`,
}))

const cadenceChartTheme: ChartConfig = {
  daily: {
    label: "Daily · 18.5%",
    theme: {
      light: "hsl(var(--chart-1))",
      dark: "hsl(var(--chart-1))",
    },
  },
  nearDaily: {
    label: "≤3 days · 13.5%",
    theme: {
      light: "hsl(var(--chart-2))",
      dark: "hsl(var(--chart-2))",
    },
  },
  weekly: {
    label: "Weekly (3–9 days) · 58.2%",
    theme: {
      light: "hsl(var(--chart-3))",
      dark: "hsl(var(--chart-3))",
    },
  },
  monthly: {
    label: "Monthly (10–29 days) · 8.3%",
    theme: {
      light: "hsl(var(--chart-4))",
      dark: "hsl(var(--chart-4))",
    },
  },
  slow: {
    label: ">30 days · 1.5%",
    theme: {
      light: "hsl(var(--chart-5))",
      dark: "hsl(var(--chart-5))",
    },
  },
} satisfies ChartConfig

const tooltipLabels: Record<(typeof cadenceData)[number]["id"], string> = {
  daily: "Daily",
  nearDaily: "Near Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  slow: "Seasonal / Other",
}

// Shorter labels for the chart itself
const chartLabels: Record<(typeof cadenceData)[number]["id"], string> = {
  daily: "Daily",
  nearDaily: "Near Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  slow: "Other",
}

// Custom label component for the donut chart segments with leader lines
function renderLabel(entry: any) {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  } = entry

  const bucket = entry.bucket || entry.payload?.bucket || ""
  const share = entry.share || entry.payload?.share || 0
  const id = entry.id || entry.payload?.id || ""

  // Always show label for "Other" category, otherwise only if segment is large enough (>5%)
  if (id !== "slow" && percent < 0.05) return null

  // Use shorter chart label instead of full bucket name
  const chartLabel = chartLabels[id as keyof typeof chartLabels] || bucket

  const RADIAN = Math.PI / 180

  // Calculate positions: end of outer radius and label position outside
  const outerX = cx + outerRadius * Math.cos(-midAngle * RADIAN)
  const outerY = cy + outerRadius * Math.sin(-midAngle * RADIAN)

  // Extend label further outside
  const labelRadius = outerRadius + 20
  const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN)
  const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN)

  // Determine text anchor based on angle (left side vs right side)
  const textAnchor = midAngle < 90 || midAngle > 270 ? "start" : "end"
  const labelColor = "hsl(var(--foreground))"

  return (
    <g>
      {/* Leader line from outer edge to label */}
      <line
        x1={outerX}
        y1={outerY}
        x2={labelX}
        y2={labelY}
        stroke={labelColor}
        strokeWidth={1}
        opacity={0.3}
      />
      {/* Label text */}
      <text
        x={labelX}
        y={labelY}
        fill={labelColor}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={11}
        fontWeight={500}
        className="pointer-events-none select-none"
      >
        <tspan>{chartLabel}</tspan>
      </text>
    </g>
  )
}

function CadenceTooltip({
  active,
  payload,
}: TooltipProps<(typeof cadenceData)[number]["shows"], string>) {
  if (!active || !payload?.length) {
    return null
  }

  const dataPoint = payload[0]?.payload as (typeof cadenceData)[number] | undefined
  if (!dataPoint) {
    return null
  }

  const label = tooltipLabels[dataPoint.id] ?? dataPoint.bucket

  // Find the matching segment to get the color and share
  const segment = chartSegments.find((s) => s.id === dataPoint.id)
  const color = segment?.colorVar ?? "var(--chart-1)"

  const count = dataPoint.shows.toLocaleString()
  const percentage = segment?.share.toFixed(1) ?? ((dataPoint.shows / BASE_TOTAL) * 100).toFixed(1)

  return (
    <div className="rounded-md border border-border/50 bg-background px-3 py-2 text-xs shadow-lg">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <span
          className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
          style={{ backgroundColor: `hsl(${color})` }}
        />
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-muted-foreground">
        <span>{count} shows</span>
        <span className="font-mono text-foreground">{percentage}%</span>
      </div>
    </div>
  )
}

export function PublishCadenceChart() {
  return (
    <Card className="border-border/70 bg-background">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-base font-semibold">
          Top 1% Podcast Cadence
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution of 1,000 highest-audience shows by publishing frequency.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center px-4 pb-6">
        <div className="relative w-full">
          <ChartContainer
            config={cadenceChartTheme}
            className="mx-auto aspect-square h-[360px] w-full max-w-[420px]"
          >
            <PieChart margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
              <ChartTooltip cursor={false} content={<CadenceTooltip />} />
              <Pie
                data={chartSegments}
                dataKey="shows"
                nameKey="bucket"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={3}
                strokeWidth={2}
                label={renderLabel}
                labelLine={false}
              >
                {chartSegments.map((item) => (
                  <Cell key={item.id} fill={`hsl(${item.colorVar})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <span className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            Adithyan Ilangovan | adithyan.io
          </span>
        </div>
        {/* Horizontal legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
          {chartSegments.map((segment) => {
            const legendLabel = chartLabels[segment.id as keyof typeof chartLabels] || segment.bucket
            return (
              <div
                key={segment.id}
                className="flex items-center gap-1.5"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: `hsl(${segment.colorVar})` }}
                />
                <span className="text-foreground">{legendLabel}</span>
                <span className="font-mono text-muted-foreground">
                  {segment.share.toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
