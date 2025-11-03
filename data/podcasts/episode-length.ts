export type EpisodeBucketId =
  | "under10"
  | "tenToTwenty"
  | "twentyToForty"
  | "fortyToSixty"
  | "sixtyToNinety"
  | "ninetyPlus";

export type EpisodeLengthCounts = Record<EpisodeBucketId, number>;

export type EpisodeGroup =
  | "overall"
  | "daily"
  | "nearDaily"
  | "weekly"
  | "monthly"
  | "other";

export const EPISODE_LENGTH_DATA: Record<EpisodeGroup, EpisodeLengthCounts> = {
  overall: {
    under10: 5,
    tenToTwenty: 38,
    twentyToForty: 232,
    fortyToSixty: 330,
    sixtyToNinety: 287,
    ninetyPlus: 108,
  },
  daily: {
    under10: 3,
    tenToTwenty: 20,
    twentyToForty: 57,
    fortyToSixty: 57,
    sixtyToNinety: 28,
    ninetyPlus: 15,
  },
  nearDaily: {
    under10: 0,
    tenToTwenty: 2,
    twentyToForty: 21,
    fortyToSixty: 44,
    sixtyToNinety: 50,
    ninetyPlus: 15,
  },
  weekly: {
    under10: 2,
    tenToTwenty: 10,
    twentyToForty: 119,
    fortyToSixty: 207,
    sixtyToNinety: 183,
    ninetyPlus: 67,
  },
  monthly: {
    under10: 0,
    tenToTwenty: 1,
    twentyToForty: 29,
    fortyToSixty: 21,
    sixtyToNinety: 20,
    ninetyPlus: 9,
  },
  other: {
    under10: 0,
    tenToTwenty: 5,
    twentyToForty: 5,
    fortyToSixty: 4,
    sixtyToNinety: 5,
    ninetyPlus: 1,
  },
} as const;

export const EPISODE_BUCKET_ORDER: EpisodeBucketId[] = [
  "under10",
  "tenToTwenty",
  "twentyToForty",
  "fortyToSixty",
  "sixtyToNinety",
  "ninetyPlus",
];
