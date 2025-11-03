"use client";

import {
  BASE_TOTAL,
  CADENCE_COUNTS,
  type CadenceId,
} from "@/data/podcasts/cadence";
import {
  EPISODE_BUCKET_ORDER,
  EPISODE_LENGTH_DATA,
  type EpisodeGroup,
} from "@/data/podcasts/episode-length";

const DECIMALS = 1;

const tableWrap =
  "mx-auto w-full max-w-3xl min-w-[28rem] table-fixed overflow-hidden rounded-2xl border border-border/60 bg-card/95 text-sm shadow-sm";
const theadCls =
  "bg-muted/20 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground/80";

const cadenceLabels: Record<CadenceId, string> = {
  daily: "Daily",
  nearDaily: "≤3 days",
  weekly: "Weekly (3–9 days)",
  monthly: "Monthly (10–29 days)",
  slow: ">30 days",
};

export function CadenceSummaryTable() {
  return (
    <div className="my-6 flex justify-center">
      <table className={tableWrap}>
        <thead className={theadCls}>
          <tr>
            <th className="px-6 py-3 font-medium">Frequency bucket*</th>
            <th className="px-6 py-3 text-right font-medium">Shows</th>
            <th className="px-6 py-3 text-right font-medium">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/35">
          {CADENCE_COUNTS.map((row) => {
            const PCT = 100;
            const share = ((row.shows / BASE_TOTAL) * PCT).toFixed(DECIMALS);
            return (
              <tr key={row.id}>
                <td className="px-6 py-3">{cadenceLabels[row.id]}</td>
                <td className="px-6 py-3 text-right">{row.shows}</td>
                <td className="px-6 py-3 text-right">{share}%</td>
              </tr>
            );
          })}
          <tr>
            <td className="px-6 py-3">
              <em>Total</em>
            </td>
            <td className="px-6 py-3 text-right">
              <em>{BASE_TOTAL.toLocaleString()}</em>
            </td>
            <td className="px-6 py-3 text-right">
              <em>100%</em>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type EpisodeLengthTableProps = {
  group: EpisodeGroup;
};

export function EpisodeLengthTable({ group }: EpisodeLengthTableProps) {
  const counts = EPISODE_LENGTH_DATA[group];
  const total = EPISODE_BUCKET_ORDER.reduce((s, id) => s + counts[id], 0);

  return (
    <div className="my-6 flex justify-center">
      <table className={tableWrap}>
        <thead className={theadCls}>
          <tr>
            <th className="px-6 py-3 font-medium">Episode Length</th>
            <th className="px-6 py-3 text-right font-medium">Shows</th>
            <th className="px-6 py-3 text-right font-medium">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/35">
          {EPISODE_BUCKET_ORDER.map((id) => {
            const shows = counts[id];
            const PCT = 100;
            const share =
              total > 0 ? ((shows / total) * PCT).toFixed(DECIMALS) : "0.0";

            let label = "";
            switch (id) {
              case "under10":
                label = "<10 minutes";
                break;
              case "tenToTwenty":
                label = "10-20 minutes";
                break;
              case "twentyToForty":
                label = "20-40 minutes";
                break;
              case "fortyToSixty":
                label = "40-60 minutes";
                break;
              case "sixtyToNinety":
                label = "60-90 minutes";
                break;
              case "ninetyPlus":
                label = "90+ minutes";
                break;
              default:
                label = String(id);
                break;
            }

            return (
              <tr key={id}>
                <td className="px-6 py-3">{label}</td>
                <td className="px-6 py-3 text-right">{shows}</td>
                <td className="px-6 py-3 text-right">{share}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
