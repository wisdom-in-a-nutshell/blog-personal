"use client";

import { Cell, Pie, PieChart, type TooltipProps } from "recharts";

import { ChartCard } from "@/components/charts/chart-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  BASE_TOTAL,
  CADENCE_COUNTS,
  type CadenceId,
} from "@/data/podcasts/cadence";

const PERCENT_FACTOR = 100;
const LABEL_MIN_SHARE = 0.05;
const LABEL_OFFSET = 20;
const LABEL_FONT_SIZE = 11;
const LEADER_LINE_WIDTH = 1;
const LEADER_LINE_OPACITY = 0.3;
const DONUT_INNER_RADIUS = 70;
const DONUT_OUTER_RADIUS = 120;
const DONUT_PADDING_ANGLE = 3;
const DONUT_STROKE_WIDTH = 2;
const RIGHT_SIDE_START_DEG = 90;
const RIGHT_SIDE_END_DEG = 270;
const DEGREE_DIVISOR = 180;
const DEGREES_TO_RADIANS = Math.PI / DEGREE_DIVISOR;
const CHART_SIGNATURE = "Adithyan Ilangovan | adithyan.io";

const cadenceBucketLabels: Record<CadenceId, string> = {
  daily: "Daily",
  nearDaily: "≤3 days",
  weekly: "Weekly (3–9 days)",
  monthly: "Monthly (10–29 days)",
  slow: ">30 days",
};

const cadenceData = CADENCE_COUNTS.map((c) => ({
  id: c.id,
  bucket: cadenceBucketLabels[c.id],
  shows: c.shows,
})) satisfies ReadonlyArray<{
  id: CadenceId;
  bucket: string;
  shows: number;
}>;

const chartSegments = cadenceData.map((segment, index) => ({
  ...segment,
  share: Number(((segment.shows / BASE_TOTAL) * PERCENT_FACTOR).toFixed(1)),
  colorVar: `var(--chart-${index + 1})`,
}));

const cadenceChartTheme: ChartConfig = {
  daily: {
    label: "Daily · 18.0%",
    theme: {
      light: "hsl(var(--chart-1))",
      dark: "hsl(var(--chart-1))",
    },
  },
  nearDaily: {
    label: "≤3 days · 13.2%",
    theme: {
      light: "hsl(var(--chart-2))",
      dark: "hsl(var(--chart-2))",
    },
  },
  weekly: {
    label: "Weekly (3–9 days) · 58.8%",
    theme: {
      light: "hsl(var(--chart-3))",
      dark: "hsl(var(--chart-3))",
    },
  },
  monthly: {
    label: "Monthly (10–29 days) · 8.0%",
    theme: {
      light: "hsl(var(--chart-4))",
      dark: "hsl(var(--chart-4))",
    },
  },
  slow: {
    label: ">30 days · 2.0%",
    theme: {
      light: "hsl(var(--chart-5))",
      dark: "hsl(var(--chart-5))",
    },
  },
} satisfies ChartConfig;

const tooltipLabels: Record<(typeof cadenceData)[number]["id"], string> = {
  daily: "Daily",
  nearDaily: "Near Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  slow: "Seasonal / Other",
};

// Shorter labels for the chart itself
const chartLabels: Record<(typeof cadenceData)[number]["id"], string> = {
  daily: "Daily",
  nearDaily: "Near Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  slow: "Other",
};

// Custom label component for the donut chart segments with leader lines
type LabelEntry = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  bucket?: string;
  share?: number;
  id?: string;
  payload?: { bucket?: string; share?: number; id?: string };
};

function renderLabel(entry: LabelEntry) {
  const { cx, cy, midAngle, outerRadius, percent } = entry;

  const bucket = entry.bucket || entry.payload?.bucket || "";
  const id = entry.id || entry.payload?.id || "";

  // Always show label for "Other" category, otherwise only if segment is large enough (>5%)
  if (id !== "slow" && percent < LABEL_MIN_SHARE) {
    return null;
  }

  // Use shorter chart label instead of full bucket name
  const chartLabel = chartLabels[id as keyof typeof chartLabels] || bucket;

  // Calculate positions: end of outer radius and label position outside
  const outerX = cx + outerRadius * Math.cos(-midAngle * DEGREES_TO_RADIANS);
  const outerY = cy + outerRadius * Math.sin(-midAngle * DEGREES_TO_RADIANS);

  // Extend label further outside
  const labelRadius = outerRadius + LABEL_OFFSET;
  const labelX = cx + labelRadius * Math.cos(-midAngle * DEGREES_TO_RADIANS);
  const labelY = cy + labelRadius * Math.sin(-midAngle * DEGREES_TO_RADIANS);

  // Determine text anchor based on angle (left side vs right side)
  const textAnchor =
    midAngle < RIGHT_SIDE_START_DEG || midAngle > RIGHT_SIDE_END_DEG
      ? "start"
      : "end";
  const labelColor = "hsl(var(--foreground))";

  return (
    <g>
      {/* Leader line from outer edge to label */}
      <line
        opacity={LEADER_LINE_OPACITY}
        stroke={labelColor}
        strokeWidth={LEADER_LINE_WIDTH}
        x1={outerX}
        x2={labelX}
        y1={outerY}
        y2={labelY}
      />
      {/* Label text */}
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
        <tspan>{chartLabel}</tspan>
      </text>
    </g>
  );
}

function CadenceTooltip({
  active,
  payload,
}: TooltipProps<(typeof cadenceData)[number]["shows"], string>) {
  if (!(active && payload?.length)) {
    return null;
  }

  const dataPoint = payload[0]?.payload as
    | (typeof cadenceData)[number]
    | undefined;
  if (!dataPoint) {
    return null;
  }

  const label = tooltipLabels[dataPoint.id] ?? dataPoint.bucket;

  // Find the matching segment to get the color and share
  const segment = chartSegments.find((s) => s.id === dataPoint.id);
  const color = segment?.colorVar ?? "var(--chart-1)";

  const count = dataPoint.shows.toLocaleString();
  const percentage =
    segment?.share.toFixed(1) ??
    ((dataPoint.shows / BASE_TOTAL) * PERCENT_FACTOR).toFixed(1);

  return (
    <div className="rounded-md border border-border/50 bg-background px-3 py-2 text-xs shadow-lg">
      <div className="flex items-center gap-2 font-medium text-foreground">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
          style={{ backgroundColor: `hsl(${color})` }}
        />
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-muted-foreground">
        <span>{count} shows</span>
        <span className="font-mono text-foreground">{percentage}%</span>
      </div>
    </div>
  );
}

export function PublishCadenceChart() {
  return (
    <ChartCard
      description="Distribution of 1,000 highest-audience shows by publishing frequency."
      downloadName="top-podcast-cadence"
      footer={
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {chartSegments.map((segment) => {
            const legendLabel =
              chartLabels[segment.id as keyof typeof chartLabels] ||
              segment.bucket;
            return (
              <div className="flex items-center gap-1.5" key={segment.id}>
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: `hsl(${segment.colorVar})` }}
                />
                <span className="text-foreground">{legendLabel}</span>
                <span className="font-mono text-muted-foreground">
                  {segment.share.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      }
      signature={CHART_SIGNATURE}
      title="Top 1% Podcast Cadence"
      watermarkClassName="w-full max-w-[420px]"
      watermarkVariant="inline"
    >
      <ChartContainer
        className="mx-auto aspect-square h-[360px] w-full max-w-[420px]"
        config={cadenceChartTheme}
      >
        <PieChart margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
          <ChartTooltip content={<CadenceTooltip />} cursor={false} />
          <Pie
            data={chartSegments}
            dataKey="shows"
            innerRadius={DONUT_INNER_RADIUS}
            label={renderLabel}
            labelLine={false}
            nameKey="bucket"
            outerRadius={DONUT_OUTER_RADIUS}
            paddingAngle={DONUT_PADDING_ANGLE}
            strokeWidth={DONUT_STROKE_WIDTH}
          >
            {chartSegments.map((item) => (
              <Cell fill={`hsl(${item.colorVar})`} key={item.id} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
}
