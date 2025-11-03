export type CadenceId = "daily" | "nearDaily" | "weekly" | "monthly" | "slow";

export const BASE_TOTAL = 1000 as const;

export const CADENCE_COUNTS: ReadonlyArray<{ id: CadenceId; shows: number }> = [
  { id: "daily", shows: 180 },
  { id: "nearDaily", shows: 132 },
  { id: "weekly", shows: 588 },
  { id: "monthly", shows: 80 },
  { id: "slow", shows: 20 },
] as const;
