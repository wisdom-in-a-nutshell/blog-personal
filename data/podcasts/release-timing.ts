export type WeekdayId = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const WEEKDAY_ORDER: WeekdayId[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export const EVALUATED_TOTAL = 582 as const;

// Count of shows (each show votes once for its modal weekday)
export const RELEASE_WEEKDAY_COUNTS: ReadonlyArray<{
  id: WeekdayId;
  shows: number;
}> = [
  { id: "Mon", shows: 130 },
  { id: "Tue", shows: 131 },
  { id: "Wed", shows: 124 },
  { id: "Thu", shows: 90 },
  { id: "Fri", shows: 70 },
  { id: "Sat", shows: 12 },
  { id: "Sun", shows: 25 },
] as const;

export type StabilityBandId = "ge80" | "p60_79" | "p40_59" | "lt40";

export const STABILITY_BANDS: ReadonlyArray<{
  id: StabilityBandId;
  label: string;
  shows: number;
}> = [
  { id: "ge80", label: "≥80%", shows: 308 },
  { id: "p60_79", label: "60–79%", shows: 86 },
  { id: "p40_59", label: "40–59%", shows: 158 },
  { id: "lt40", label: "<40%", shows: 30 },
] as const;
