export const HOSTING_PROVIDER_ORDER = [
  "megaphone",
  "simplecast",
  "omny",
  "art19",
  "libsyn",
  "acast",
  "spotifyAnchor",
  "buzzsprout",
  "firstParty",
  "unknown",
  "rest",
] as const;

export type HostingProviderId = (typeof HOSTING_PROVIDER_ORDER)[number];

export const HOSTING_PROVIDER_LABELS: Record<HostingProviderId, string> = {
  megaphone: "Megaphone",
  simplecast: "Simplecast",
  omny: "Omny",
  art19: "ART19",
  libsyn: "Libsyn",
  acast: "Acast",
  spotifyAnchor: "Spotify / Anchor",
  buzzsprout: "Buzzsprout",
  firstParty: "First-Party RSS",
  unknown: "Unknown",
  rest: "Rest (combined)",
};

type ProviderEntry = {
  count: number;
  share: number;
};

type HostingProviderDataset = {
  totalShows: number;
  label: string;
  providers: Record<HostingProviderId, ProviderEntry>;
};

export const HOSTING_PROVIDER_DATA: Record<
  "top1k" | "top10k",
  HostingProviderDataset
> = {
  top1k: {
    totalShows: 1000,
    label: "Top 1,000 podcasts by audience",
    providers: {
      megaphone: { count: 289, share: 28.9 },
      simplecast: { count: 92, share: 9.2 },
      omny: { count: 127, share: 12.7 },
      art19: { count: 109, share: 10.9 },
      libsyn: { count: 77, share: 7.7 },
      acast: { count: 64, share: 6.4 },
      spotifyAnchor: { count: 13, share: 1.3 },
      buzzsprout: { count: 6, share: 0.6 },
      firstParty: { count: 95, share: 9.5 },
      unknown: { count: 9, share: 0.9 },
      rest: { count: 119, share: 11.9 },
    },
  },
  top10k: {
    totalShows: 10_000,
    label: "Top 10,000 podcasts by audience",
    providers: {
      megaphone: { count: 2027, share: 20.27 },
      simplecast: { count: 720, share: 7.2 },
      omny: { count: 702, share: 7.02 },
      art19: { count: 532, share: 5.32 },
      libsyn: { count: 1454, share: 14.54 },
      acast: { count: 695, share: 6.95 },
      spotifyAnchor: { count: 585, share: 5.85 },
      buzzsprout: { count: 401, share: 4.01 },
      firstParty: { count: 544, share: 5.44 },
      unknown: { count: 174, share: 1.74 },
      rest: { count: 2166, share: 21.66 },
    },
  },
};

export type HostingProviderCohort = keyof typeof HOSTING_PROVIDER_DATA;

export function listProvidersByCohort(cohort: HostingProviderCohort): Array<
  {
    id: HostingProviderId;
  } & ProviderEntry
> {
  const dataset = HOSTING_PROVIDER_DATA[cohort];

  return HOSTING_PROVIDER_ORDER.map((id) => {
    const entry = dataset.providers[id];
    return {
      id,
      count: entry?.count ?? 0,
      share: entry?.share ?? 0,
    };
  });
}
