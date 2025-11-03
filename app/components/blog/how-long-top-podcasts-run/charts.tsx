"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/charts/chart-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

const EPISODE_LENGTH_BUCKETS = [
  { id: "under10", label: "<10 minutes" },
  { id: "tenToTwenty", label: "10–20 minutes" },
  { id: "twentyToForty", label: "20–40 minutes" },
  { id: "fortyToSixty", label: "40–60 minutes" },
  { id: "sixtyToNinety", label: "60–90 minutes" },
  { id: "ninetyPlus", label: "90+ minutes" },
] as const;

type EpisodeLengthBucketId = (typeof EPISODE_LENGTH_BUCKETS)[number]["id"];

type EpisodeLengthBucketInput = {
  id: EpisodeLengthBucketId;
  shows: number;
};

type EpisodeLengthSegment = {
  id: EpisodeLengthBucketId;
  label: string;
  shows: number;
  share: number;
  shareLabel: string;
  colorVar: string;
};

const CHART_SIGNATURE = "Adithyan Ilangovan | adithyan.io";
const PERCENT_FACTOR = 100;
const MIN_POINT_SIZE = 4;
const ZERO_RADIUS = 0;
const CORNER_RADIUS = 6;
const BAR_RADIUS: [number, number, number, number] = [
  ZERO_RADIUS,
  CORNER_RADIUS,
  CORNER_RADIUS,
  ZERO_RADIUS,
];

const OVERALL_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 5 },
  { id: "tenToTwenty", shows: 38 },
  { id: "twentyToForty", shows: 232 },
  { id: "fortyToSixty", shows: 330 },
  { id: "sixtyToNinety", shows: 287 },
  { id: "ninetyPlus", shows: 108 },
];

const DAILY_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 3 },
  { id: "tenToTwenty", shows: 20 },
  { id: "twentyToForty", shows: 57 },
  { id: "fortyToSixty", shows: 57 },
  { id: "sixtyToNinety", shows: 28 },
  { id: "ninetyPlus", shows: 15 },
];

const NEAR_DAILY_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 0 },
  { id: "tenToTwenty", shows: 2 },
  { id: "twentyToForty", shows: 21 },
  { id: "fortyToSixty", shows: 44 },
  { id: "sixtyToNinety", shows: 50 },
  { id: "ninetyPlus", shows: 15 },
];

const WEEKLY_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 2 },
  { id: "tenToTwenty", shows: 10 },
  { id: "twentyToForty", shows: 119 },
  { id: "fortyToSixty", shows: 207 },
  { id: "sixtyToNinety", shows: 183 },
  { id: "ninetyPlus", shows: 67 },
];

const MONTHLY_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 0 },
  { id: "tenToTwenty", shows: 1 },
  { id: "twentyToForty", shows: 29 },
  { id: "fortyToSixty", shows: 21 },
  { id: "sixtyToNinety", shows: 20 },
  { id: "ninetyPlus", shows: 9 },
];

const OTHER_BUCKETS: EpisodeLengthBucketInput[] = [
  { id: "under10", shows: 0 },
  { id: "tenToTwenty", shows: 5 },
  { id: "twentyToForty", shows: 5 },
  { id: "fortyToSixty", shows: 4 },
  { id: "sixtyToNinety", shows: 5 },
  { id: "ninetyPlus", shows: 1 },
];

function sanitizeShows(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return value >= 0 ? value : 0;
}

function buildSegments(buckets: EpisodeLengthBucketInput[]) {
  const sanitizedMap = new Map<EpisodeLengthBucketId, number>();

  for (const bucket of buckets) {
    sanitizedMap.set(bucket.id, sanitizeShows(bucket.shows));
  }

  const total = Array.from(sanitizedMap.values()).reduce(
    (sum, value) => sum + value,
    0
  );

  const segments: EpisodeLengthSegment[] = EPISODE_LENGTH_BUCKETS.map(
    (bucket, index) => {
      const shows = sanitizedMap.get(bucket.id) ?? 0;
      const share =
        total > 0 ? Number(((shows / total) * PERCENT_FACTOR).toFixed(1)) : 0;

      return {
        id: bucket.id,
        label: bucket.label,
        shows,
        share,
        shareLabel: `${share.toFixed(1)}%`,
        colorVar: `var(--chart-${index + 1})`,
      };
    }
  );

  return { segments, total };
}

function createChartConfig(segments: EpisodeLengthSegment[]): ChartConfig {
  return segments.reduce((config, segment, index) => {
    config[segment.id] = {
      label: `${segment.label} · ${segment.share.toFixed(1)}%`,
      theme: {
        light: `hsl(var(--chart-${index + 1}))`,
        dark: `hsl(var(--chart-${index + 1}))`,
      },
    };
    return config;
  }, {} as ChartConfig);
}

function EpisodeLengthTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!(active && payload?.length)) {
    return null;
  }

  const dataPoint = payload[0]?.payload as EpisodeLengthSegment | undefined;
  if (!dataPoint) {
    return null;
  }

  const color = dataPoint.colorVar ?? "var(--chart-1)";

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
  );
}

type EpisodeLengthBarChartProps = {
  title: string;
  description?: string;
  buckets: EpisodeLengthBucketInput[];
  footerSignature?: string;
  watermarkVariant?: "overlay" | "inline";
  downloadName?: string;
};

function EpisodeLengthBarChart({
  title,
  description,
  buckets,
  footerSignature = CHART_SIGNATURE,
  watermarkVariant = "overlay",
  downloadName,
}: EpisodeLengthBarChartProps) {
  const { segments } = React.useMemo(() => buildSegments(buckets), [buckets]);
  const chartConfig = React.useMemo(
    () => createChartConfig(segments),
    [segments]
  );

  return (
    <ChartCard
      description={description}
      downloadName={downloadName}
      signature={footerSignature}
      title={title}
      watermarkVariant={watermarkVariant}
    >
      <ChartContainer className="h-[360px] w-full" config={chartConfig}>
        <BarChart
          data={segments}
          layout="vertical"
          margin={{ top: 8, right: 32, bottom: 8, left: 120 }}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="2 8"
            strokeOpacity={0.2}
          />
          <XAxis
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            tickLine={false}
            type="number"
          />
          <YAxis
            axisLine={false}
            dataKey="label"
            tickLine={false}
            type="category"
            width={120}
          />
          <ChartTooltip
            content={<EpisodeLengthTooltip />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
          />
          <Bar
            dataKey="shows"
            minPointSize={MIN_POINT_SIZE}
            radius={BAR_RADIUS}
          >
            {segments.map((segment) => (
              <Cell
                fill={`hsl(${segment.colorVar})`}
                key={segment.id}
                stroke="transparent"
              />
            ))}
            <LabelList
              className="fill-foreground font-medium text-xs"
              dataKey="shareLabel"
              position="right"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function EpisodeLengthHistogram() {
  return (
    <EpisodeLengthBarChart
      buckets={OVERALL_BUCKETS}
      description="Episode length distribution for the top 1,000 highest-audience shows."
      downloadName="episode-length-distribution"
      title="How Long Are Top Podcast Episodes?"
      watermarkVariant="inline"
    />
  );
}

export function DailyEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      buckets={DAILY_BUCKETS}
      description="Episode length distribution for the top 180 daily-publishing shows."
      downloadName="daily-episode-length"
      title="Daily Shows: How Long Do Episodes Run?"
      watermarkVariant="inline"
    />
  );
}

export function NearDailyEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      buckets={NEAR_DAILY_BUCKETS}
      description="Episode length distribution for the top 132 near-daily shows."
      downloadName="near-daily-episode-length"
      title="Near-Daily Shows: How Long Do Episodes Run?"
      watermarkVariant="inline"
    />
  );
}

export function WeeklyEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      buckets={WEEKLY_BUCKETS}
      description="Episode length distribution for the top 588 weekly-publishing shows."
      downloadName="weekly-episode-length"
      title="Weekly Shows: How Long Do Episodes Run?"
      watermarkVariant="inline"
    />
  );
}

export function MonthlyEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      buckets={MONTHLY_BUCKETS}
      description="Episode length distribution for the top 80 monthly-publishing shows."
      downloadName="monthly-episode-length"
      title="Monthly Shows: How Long Do Episodes Run?"
      watermarkVariant="inline"
    />
  );
}

export function OtherEpisodeLengthChart() {
  return (
    <EpisodeLengthBarChart
      buckets={OTHER_BUCKETS}
      description="Episode length distribution for the top 20 shows publishing slower than monthly."
      downloadName="other-episode-length"
      title="Other Cadence Shows: How Long Do Episodes Run?"
      watermarkVariant="inline"
    />
  );
}
