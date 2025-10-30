"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const cadenceData = [
  {
    bucket: "≤ 7 days",
    shows: 42,
    percentileLabel: "P90",
  },
  {
    bucket: "8–14 days",
    shows: 33,
    percentileLabel: "P75",
  },
  {
    bucket: "15–30 days",
    shows: 21,
    percentileLabel: "P50",
  },
  {
    bucket: "31–45 days",
    shows: 14,
    percentileLabel: "P40",
  },
  {
    bucket: "46–60 days",
    shows: 9,
    percentileLabel: "P30",
  },
  {
    bucket: "61–90 days",
    shows: 6,
    percentileLabel: "P20",
  },
  {
    bucket: "90+ days",
    shows: 5,
    percentileLabel: "Dormant",
  },
]

const cadenceChartConfig = {
  shows: {
    label: "Shows",
    theme: {
      light: "hsl(var(--chart-1))",
      dark: "hsl(var(--chart-1))",
    },
  },
} satisfies ChartConfig

export function PublishCadenceChart() {
  return (
    <Card className="border-border/70 bg-background">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-base font-semibold">
          Top Shows by Release Cadence
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sample dataset illustrating how frequently the top cohort publishes.
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-6">
        <ChartContainer config={cadenceChartConfig} className="h-[320px]">
          <BarChart data={cadenceData}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="bucket"
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="shows" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
