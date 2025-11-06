"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
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
import {
  EVALUATED_TOTAL,
  RELEASE_WEEKDAY_COUNTS,
  STABILITY_BANDS,
  WEEKDAY_ORDER,
} from "@/data/podcasts/release-timing";

const CHART_SIGNATURE = "Adithyan Ilangovan | adithyan.io";
const PERCENT_FACTOR = 100;
const ZERO_RADIUS = 0;
const CORNER_RADIUS = 6;
const BAR_RADIUS: [number, number, number, number] = [
  ZERO_RADIUS,
  CORNER_RADIUS,
  CORNER_RADIUS,
  ZERO_RADIUS,
];
const COLOR_SLOT_COUNT = 5;
const WEEKDAY_TICK_STEP = 5;
const WEEKDAY_MAX_PERCENT = 25;

type WeekdaySegment = {
  id: string;
  label: string;
  shows: number;
  share: number;
  shareLabel: string;
  colorVar: string;
};

type BandSegment = {
  id: string;
  label: string;
  shows: number;
  share: number;
  shareLabel: string;
  colorVar: string;
};

function buildWeekdaySegments(): WeekdaySegment[] {
  const map = new Map(RELEASE_WEEKDAY_COUNTS.map((d) => [d.id, d.shows]));
  return WEEKDAY_ORDER.map((day, index) => {
    const shows = map.get(day) ?? 0;
    const share =
      EVALUATED_TOTAL > 0
        ? Number(((shows / EVALUATED_TOTAL) * PERCENT_FACTOR).toFixed(1))
        : 0;
    return {
      id: day,
      label: day,
      shows,
      share,
      shareLabel: `${share.toFixed(1)}%`,
      colorVar: `var(--chart-${(index % COLOR_SLOT_COUNT) + 1})`,
    };
  });
}

function buildStabilitySegments(): BandSegment[] {
  return STABILITY_BANDS.map((b, index) => {
    const share =
      EVALUATED_TOTAL > 0
        ? Number(((b.shows / EVALUATED_TOTAL) * PERCENT_FACTOR).toFixed(1))
        : 0;
    return {
      id: b.id,
      label: b.label,
      shows: b.shows,
      share,
      shareLabel: `${share.toFixed(1)}%`,
      colorVar: `var(--chart-${(index % COLOR_SLOT_COUNT) + 1})`,
    };
  });
}

function createConfig<T extends { id: string; label: string; share: number }>(
  segments: T[]
): ChartConfig {
  return segments.reduce((acc, seg, index) => {
    acc[seg.id] = {
      label: `${seg.label} · ${seg.share.toFixed(1)}%`,
      theme: {
        light: `hsl(var(--chart-${(index % COLOR_SLOT_COUNT) + 1}))`,
        dark: `hsl(var(--chart-${(index % COLOR_SLOT_COUNT) + 1}))`,
      },
    };
    return acc;
  }, {} as ChartConfig);
}

function WeekdayTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!(active && payload?.length)) {
    return null;
  }
  const dataPoint = payload[0]?.payload as WeekdaySegment | undefined;
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

function BandTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!(active && payload?.length)) {
    return null;
  }
  const dataPoint = payload[0]?.payload as BandSegment | undefined;
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
        <span>{dataPoint.label} stability</span>
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

export function ReleaseWeekdayChart() {
  const segments = React.useMemo(buildWeekdaySegments, []);
  const config = React.useMemo(() => createConfig(segments), [segments]);

  return (
    <ChartCard
      description={`From the top 1,000 shows, ${EVALUATED_TOTAL.toLocaleString()} publish weekly. This chart shows which weekday they release new episodes.`}
      downloadName="release-weekday-weekly"
      signature={CHART_SIGNATURE}
      title="When Do Top Weekly Shows Release?"
      watermarkVariant="inline"
    >
      <ChartContainer className="h-[360px] w-full" config={config}>
        <BarChart
          data={segments}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 28, left: 100 }}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="2 8"
            strokeOpacity={0.2}
          />
          <XAxis
            axisLine={false}
            domain={[0, WEEKDAY_MAX_PERCENT]}
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
            ticks={Array.from(
              { length: WEEKDAY_MAX_PERCENT / WEEKDAY_TICK_STEP + 1 },
              (_, idx) => idx * WEEKDAY_TICK_STEP
            )}
            type="number"
          />
          <YAxis
            axisLine={false}
            dataKey="label"
            tickLine={false}
            type="category"
            width={80}
          />
          <ChartTooltip
            content={<WeekdayTooltip />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
          />
          <Bar dataKey="share" minPointSize={4} radius={BAR_RADIUS}>
            {segments.map((s) => (
              <Cell
                fill={`hsl(${s.colorVar})`}
                key={s.id}
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

export function ReleaseStabilityChart() {
  const segments = React.useMemo(buildStabilitySegments, []);
  const config = React.useMemo(() => createConfig(segments), [segments]);

  return (
    <ChartCard
      description={`From the top 1,000 shows, ${EVALUATED_TOTAL.toLocaleString()} publish weekly. For each show, we checked how often it released on the same weekday. ≥80% means 4 out of the last 5 episodes land on the same day.`}
      downloadName="release-weekly-stability"
      signature={CHART_SIGNATURE}
      title="How Consistent Are Top Weekly Shows?"
      watermarkVariant="inline"
    >
      <ChartContainer className="h-[360px] w-full" config={config}>
        <BarChart
          data={segments}
          layout="vertical"
          margin={{ top: 8, right: 48, bottom: 28, left: 120 }}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="2 8"
            strokeOpacity={0.2}
          />
          <XAxis
            axisLine={false}
            tickFormatter={(v) => `${v}`}
            tickLine={false}
            type="number"
          >
            <Label
              className="fill-muted-foreground"
              offset={10}
              position="bottom"
              value="Shows (count)"
            />
          </XAxis>
          <YAxis
            axisLine={false}
            dataKey="label"
            tickLine={false}
            type="category"
            width={120}
          />
          <ChartTooltip
            content={<BandTooltip />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
          />
          <Bar dataKey="shows" minPointSize={4} radius={BAR_RADIUS}>
            {segments.map((s) => (
              <Cell
                fill={`hsl(${s.colorVar})`}
                key={s.id}
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
