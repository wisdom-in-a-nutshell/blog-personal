"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts"

import { ChartWatermark } from "@/components/charts/watermark"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

const EPISODE_LENGTH_BUCKETS = [
  { id: "under10", label: "<10 minutes" },
  { id: "tenToTwenty", label: "10–20 minutes" },
  { id: "twentyToForty", label: "20–40 minutes" },
  { id: "fortyToSixty", label: "40–60 minutes" },
  { id: "sixtyToNinety", label: "60–90 minutes" },
  { id: "ninetyPlus", label: "90+ minutes" },
] as const

type EpisodeLengthBucketId = (typeof EPISODE_LENGTH_BUCKETS)[number]["id"]

type EpisodeLengthBucketInput = {
  id: EpisodeLengthBucketId
  shows: number
}

type EpisodeLengthSegment = {
  id: EpisodeLengthBucketId
  label: string
  shows: number
  share: number
  shareLabel: string
  colorVar: string
}

const CHART_SIGNATURE = "Adithyan Ilangovan | adithyan.io"

const OVERALL_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 5 },
  { id: "tenToTwenty", shows: 38 },
  { id: "twentyToForty", shows: 232 },
  { id: "fortyToSixty", shows: 330 },
  { id: "sixtyToNinety", shows: 287 },
  { id: "ninetyPlus", shows: 108 },
]

const DAILY_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 3 },
  { id: "tenToTwenty", shows: 20 },
  { id: "twentyToForty", shows: 57 },
  { id: "fortyToSixty", shows: 57 },
  { id: "sixtyToNinety", shows: 28 },
  { id: "ninetyPlus", shows: 15 },
]

const NEAR_DAILY_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 0 },
  { id: "tenToTwenty", shows: 2 },
  { id: "twentyToForty", shows: 21 },
  { id: "fortyToSixty", shows: 44 },
  { id: "sixtyToNinety", shows: 50 },
  { id: "ninetyPlus", shows: 15 },
]

const WEEKLY_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 2 },
  { id: "tenToTwenty", shows: 10 },
  { id: "twentyToForty", shows: 119 },
  { id: "fortyToSixty", shows: 202 },
  { id: "sixtyToNinety", shows: 183 },
  { id: "ninetyPlus", shows: 67 },
]

const MONTHLY_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 0 },
  { id: "tenToTwenty", shows: 1 },
  { id: "twentyToForty", shows: 29 },
  { id: "fortyToSixty", shows: 21 },
  { id: "sixtyToNinety", shows: 20 },
  { id: "ninetyPlus", shows: 9 },
]

const OTHER_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 0 },
  { id: "tenToTwenty", shows: 5 },
  { id: "twentyToForty", shows: 5 },
  { id: "fortyToSixty", shows: 4 },
  { id: "sixtyToNinety", shows: 5 },
  { id: "ninetyPlus", shows: 1 },
]

function sanitizeShows(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return value >= 0 ? value : 0
}

function buildSegments(buckets: EpisodeLengthBucketInput[]) {
  const sanitizedMap = new Map<EpisodeLengthBucketId, number>()

  for (const bucket of buckets) {
    sanitizedMap.set(bucket.id, sanitizeShows(bucket.shows))
  }

  const total = Array.from(sanitizedMap.values()).reduce(
    (sum, value) => sum + value,
    0
  )

  const segments: EpisodeLengthSegment[] = EPISODE_LENGTH_BUCKETS.map(
    (bucket, index) => {
      const shows = sanitizedMap.get(bucket.id) ?? 0
      const share =
        total > 0 ? Number(((shows / total) * 100).toFixed(1)) : 0

      return {
        id: bucket.id,
        label: bucket.label,
        shows,
        share,
        shareLabel: `${share.toFixed(1)}%`,
        colorVar: `var(--chart-${index + 1})`,
      }
    }
  )

  return { segments, total }
}

function createChartConfig(segments: EpisodeLengthSegment[]): ChartConfig {
  return segments.reduce((config, segment, index) => {
    config[segment.id] = {
      label: `${segment.label} · ${segment.share.toFixed(1)}%`,
      theme: {
        light: `hsl(var(--chart-${index + 1}))`,
        dark: `hsl(var(--chart-${index + 1}))`,
      },
    }
    return config
  }, {} as ChartConfig)
}

function EpisodeLengthTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null
  }

  const dataPoint = payload[0]?.payload as EpisodeLengthSegment | undefined
  if (!dataPoint) {
    return null
  }

  const color = dataPoint.colorVar ?? "var(--chart-1)"

  return (
    <div className="rounded-md border border-border/50 bg-background px-3 py-2 text-xs shadow-lg">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
          style={{ backgroundColor: `hsl(${color})` }}
        />
        <span>{dataPoint.label}</span>
      </div>
      <div className="mt-1 flex justify-between text-muted-foreground">
        <span>{dataPoint.shows.toLocaleString()} shows</span>
        <span className="font-mono text-foreground">
          {dataPoint.share.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

type EpisodeLengthBarChartProps = {
  title: string
  description?: string
  buckets: EpisodeLengthBucketInput[]
  footerSignature?: string
  watermarkVariant?: "overlay" | "inline"
}

function EpisodeLengthBarChart({
  title,
  description,
  buckets,
  footerSignature = CHART_SIGNATURE,
  watermarkVariant = "overlay",
}: EpisodeLengthBarChartProps) {
  const { segments } = React.useMemo(() => buildSegments(buckets), [buckets])
  const chartConfig = React.useMemo(
    () => createChartConfig(segments),
    [segments]
  )

  return (
    <Card className="border-border/70 bg-background">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="px-4 pb-6">
        <div className="relative w-full">
          <ChartContainer
            config={chartConfig}
            className="h-[360px] w-full"
          >
            <BarChart
              data={segments}
              layout="vertical"
              margin={{ top: 8, right: 32, bottom: 8, left: 120 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="4 6" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis
                type="category"
                dataKey="label"
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                content={<EpisodeLengthTooltip />}
              />
              <Bar dataKey="shows" radius={[0, 6, 6, 0]} minPointSize={4}>
                {segments.map((segment) => (
                  <Cell
                    key={segment.id}
                    fill={`hsl(${segment.colorVar})`}
                    stroke="transparent"
                  />
                ))}
                <LabelList
                  dataKey="shareLabel"
                  position="right"
                  className="fill-foreground text-xs font-medium"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
          {footerSignature ? (
            <ChartWatermark text={footerSignature} variant={watermarkVariant} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export function EpisodeLengthHistogram() {
  return (
    <EpisodeLengthBarChart
      title="Episode Length Distribution"
      description="Length buckets for 1,000 highest-audience podcasts."
      buckets={OVERALL_BUCKETS}
      watermarkVariant="inline"
    />
  )
}

export function DailyEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      title="Daily Shows · Episode Length"
      description="Distribution for 180 daily-publishing shows."
      buckets={DAILY_BUCKETS}
      watermarkVariant="inline"
    />
  )
}

export function NearDailyEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      title="Near-Daily Shows · Episode Length"
      description="Distribution for 132 shows publishing every 2–3 days."
      buckets={NEAR_DAILY_BUCKETS}
      watermarkVariant="inline"
    />
  )
}

export function WeeklyEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      title="Weekly Shows · Episode Length"
      description="Distribution for 583 weekly shows."
      buckets={WEEKLY_BUCKETS}
      watermarkVariant="inline"
    />
  )
}

export function MonthlyEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      title="Monthly Shows · Episode Length"
      description="Distribution for 80 shows publishing every 10–29 days."
      buckets={MONTHLY_BUCKETS}
      watermarkVariant="inline"
    />
  )
}

export function OtherEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      title="Other Cadence Shows · Episode Length"
      description="Distribution for 20 shows publishing slower than monthly."
      buckets={OTHER_BUCKETS}
      watermarkVariant="inline"
    />
  )
}
