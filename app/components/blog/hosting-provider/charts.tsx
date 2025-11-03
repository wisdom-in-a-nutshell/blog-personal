"use client";

import React from "react";
import { Cell, Pie, PieChart, type TooltipProps } from "recharts";

import { ChartCard } from "@/components/charts/chart-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  HOSTING_PROVIDER_DATA,
  HOSTING_PROVIDER_LABELS,
  HOSTING_PROVIDER_ORDER,
  type HostingProviderCohort,
  type HostingProviderId,
} from "@/data/podcasts/hosting-provider";

const CHART_SIGNATURE = "Adithyan Ilangovan | adithyan.io";
const COLOR_SLOT_COUNT = 5;
const AGGREGATE_TOP_COUNT = 6;
const ALWAYS_INCLUDE: HostingProviderId[] = ["firstParty"];
const DONUT_INNER_RADIUS = 70;
const DONUT_OUTER_RADIUS = 120;
const DONUT_PADDING_ANGLE = 3;
const DONUT_STROKE_WIDTH = 2;
const DONUT_START_ANGLE = 90;
const DONUT_END_ANGLE = 450;
const LABEL_MIN_SHARE_FRACTION = 0.05;
const LABEL_OFFSET = 20;
const LABEL_FONT_SIZE = 12;
const LEADER_LINE_OPACITY = 0.28;
const LEADER_LINE_WIDTH = 1;
const PERCENT_PRECISION = 1;
const DEGREE_DIVISOR = 180;
const DEGREES_TO_RADIANS = Math.PI / DEGREE_DIVISOR;
const RIGHT_SIDE_START_DEG = 90;
const RIGHT_SIDE_END_DEG = 270;

type AggregateSegment = {
  id: HostingProviderId | "others";
  label: string;
  share: number;
  shareLabel: string;
  count: number;
  colorVar: string;
};

type HostingProviderAggregateChartProps = {
  cohort: HostingProviderCohort;
  title?: string;
  description?: string;
  downloadName?: string;
  topCount?: number;
};

function buildAggregateSegments(
  cohort: HostingProviderCohort,
  topCount: number = AGGREGATE_TOP_COUNT
): AggregateSegment[] {
  const dataset = HOSTING_PROVIDER_DATA[cohort];
  const entries = HOSTING_PROVIDER_ORDER.map((id) => ({
    id,
    label: HOSTING_PROVIDER_LABELS[id] ?? id,
    share: dataset.providers[id]?.share ?? 0,
    count: dataset.providers[id]?.count ?? 0,
  })).filter((entry) => entry.share > 0);

  const EXCLUDE_FROM_TOP = new Set<HostingProviderId>(["rest"]);

  const sorted = entries
    .filter((entry) => !EXCLUDE_FROM_TOP.has(entry.id))
    .sort((a, b) => b.share - a.share);

  const selected = sorted.slice(0, topCount);

  for (const id of ALWAYS_INCLUDE) {
    if (selected.some((segment) => segment.id === id)) {
      continue;
    }
    const match = sorted.find((segment) => segment.id === id);
    if (match) {
      selected.push(match);
    }
  }

  const deduped = Array.from(
    new Map(selected.map((segment) => [segment.id, segment])).values()
  ).sort((a, b) => b.share - a.share);

  const selectedIds = new Set(deduped.map((segment) => segment.id));

  const others = entries.filter((entry) => !selectedIds.has(entry.id));
  const othersShare = others.reduce((sum, entry) => sum + entry.share, 0);
  const othersCount = others.reduce((sum, entry) => sum + entry.count, 0);

  const segments: AggregateSegment[] = deduped.map((segment, index) => {
    const colorSlot = (index % COLOR_SLOT_COUNT) + 1;
    return {
      id: segment.id,
      label: segment.label,
      share: segment.share,
      shareLabel: `${segment.share.toFixed(PERCENT_PRECISION)}%`,
      count: segment.count,
      colorVar: `var(--chart-${colorSlot})`,
    };
  });

  if (othersShare > 0) {
    const colorSlot = (segments.length % COLOR_SLOT_COUNT) + 1;
    segments.push({
      id: "others",
      label: "Everything else",
      share: Number(othersShare.toFixed(PERCENT_PRECISION + 1)),
      shareLabel: `${othersShare.toFixed(PERCENT_PRECISION)}%`,
      count: othersCount,
      colorVar: `var(--chart-${colorSlot})`,
    });
  }

  return segments;
}

function createChartConfig(segments: AggregateSegment[]): ChartConfig {
  return segments.reduce((config, segment) => {
    config[segment.id] = {
      label: `${segment.label} · ${segment.share.toFixed(PERCENT_PRECISION)}%`,
      theme: {
        light: `hsl(${segment.colorVar})`,
        dark: `hsl(${segment.colorVar})`,
      },
    };
    return config;
  }, {} as ChartConfig);
}

function HostingProviderAggregateTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!(active && payload?.length)) {
    return null;
  }

  const dataPoint = payload[0]?.payload as AggregateSegment | undefined;
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
        <span>{dataPoint.count.toLocaleString()} shows</span>
        <span className="font-mono text-foreground">
          {dataPoint.share.toFixed(PERCENT_PRECISION)}%
        </span>
      </div>
    </div>
  );
}

type DonutLabelEntry = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  payload?: AggregateSegment;
};

function renderAggregateLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  payload,
}: DonutLabelEntry) {
  if (!payload) {
    return null;
  }

  if (payload.id !== "others" && percent < LABEL_MIN_SHARE_FRACTION) {
    return null;
  }

  const radians = -midAngle * DEGREES_TO_RADIANS;
  const outerX = cx + outerRadius * Math.cos(radians);
  const outerY = cy + outerRadius * Math.sin(radians);

  const labelRadius = outerRadius + LABEL_OFFSET;
  const labelX = cx + labelRadius * Math.cos(radians);
  const labelY = cy + labelRadius * Math.sin(radians);

  const textAnchor =
    midAngle < RIGHT_SIDE_START_DEG || midAngle > RIGHT_SIDE_END_DEG
      ? "start"
      : "end";
  const labelColor = "hsl(var(--foreground))";

  return (
    <g>
      <line
        opacity={LEADER_LINE_OPACITY}
        stroke={labelColor}
        strokeWidth={LEADER_LINE_WIDTH}
        x1={outerX}
        x2={labelX}
        y1={outerY}
        y2={labelY}
      />
      <text
        className="pointer-events-none select-none"
        dominantBaseline="central"
        fill={labelColor}
        fontSize={LABEL_FONT_SIZE}
        fontWeight={500}
        textAnchor={textAnchor}
        x={labelX}
        y={labelY}
      >
        <tspan>{payload.label}</tspan>
        <tspan dx={4}>{payload.share.toFixed(PERCENT_PRECISION)}%</tspan>
      </text>
    </g>
  );
}

function HostingProviderAggregateDonut({
  cohort,
  title,
  description,
  downloadName,
  topCount = AGGREGATE_TOP_COUNT,
}: HostingProviderAggregateChartProps) {
  const segments = React.useMemo(
    () => buildAggregateSegments(cohort, topCount),
    [cohort, topCount]
  );
  const chartConfig = React.useMemo(
    () => createChartConfig(segments),
    [segments]
  );

  const defaultTitles: Record<HostingProviderCohort, string> = {
    top1k: "Who Hosts the Top 1,000 Podcasts?",
    top10k: "Who Hosts the Top 10,000 Podcasts?",
  };

  const defaultDescriptions: Record<HostingProviderCohort, string> = {
    top1k:
      "Market share of feed hosting providers for the 1,000 highest-audience shows.",
    top10k:
      "Market share of feed hosting providers for the 10,000 highest-audience shows.",
  };

  const defaultDownloads: Record<HostingProviderCohort, string> = {
    top1k: "feed-host-share-top-1000",
    top10k: "feed-host-share-top-10000",
  };

  return (
    <ChartCard
      description={description ?? defaultDescriptions[cohort]}
      downloadName={downloadName ?? defaultDownloads[cohort]}
      signature={CHART_SIGNATURE}
      title={title ?? defaultTitles[cohort]}
      watermarkVariant="inline"
    >
      <ChartContainer
        className="h-[320px] w-full"
        config={chartConfig}
        id={`hosting-provider-aggregate-${cohort}`}
      >
        <PieChart>
          <Pie
            cornerRadius={6}
            data={segments}
            dataKey="share"
            endAngle={DONUT_END_ANGLE}
            innerRadius={DONUT_INNER_RADIUS}
            label={renderAggregateLabel}
            outerRadius={DONUT_OUTER_RADIUS}
            paddingAngle={DONUT_PADDING_ANGLE}
            startAngle={DONUT_START_ANGLE}
            strokeWidth={DONUT_STROKE_WIDTH}
          >
            {segments.map((segment) => (
              <Cell
                fill={`hsl(${segment.colorVar})`}
                key={segment.id}
                stroke="transparent"
              />
            ))}
          </Pie>
          <ChartTooltip content={<HostingProviderAggregateTooltip />} />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function HostingProviderTop1KAggregateChart() {
  return <HostingProviderAggregateDonut cohort="top1k" />;
}

export function HostingProviderTop10KAggregateChart() {
  return <HostingProviderAggregateDonut cohort="top10k" />;
}
