"use client";

import {
  EVALUATED_TOTAL,
  RELEASE_WEEKDAY_COUNTS,
  STABILITY_BANDS,
  WEEKDAY_ORDER,
} from "@/data/podcasts/release-timing";

const DECIMALS = 1;

const tableWrap =
  "mx-auto max-w-3xl min-w-[28rem] table-fixed overflow-hidden rounded-2xl border border-border/60 bg-card/95 text-sm shadow-sm";
const theadCls =
  "bg-muted/20 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground/80";

export function ReleaseWeekdayTable() {
  const counts = new Map(RELEASE_WEEKDAY_COUNTS.map((d) => [d.id, d.shows]));
  const PCT = 100;

  return (
    <div className="my-6 overflow-x-auto">
      <table className={tableWrap}>
        <thead className={theadCls}>
          <tr>
            <th className="px-6 py-3 font-medium">Weekday</th>
            <th className="px-6 py-3 text-right font-medium">Shows</th>
            <th className="px-6 py-3 text-right font-medium">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/35">
          {WEEKDAY_ORDER.map((day) => {
            const shows = counts.get(day) ?? 0;
            const share = ((shows / EVALUATED_TOTAL) * PCT).toFixed(DECIMALS);
            return (
              <tr key={day}>
                <td className="px-6 py-3">{day}</td>
                <td className="px-6 py-3 text-right">{shows}</td>
                <td className="px-6 py-3 text-right">{share}%</td>
              </tr>
            );
          })}
          <tr>
            <td className="px-6 py-3">
              <em>Total</em>
            </td>
            <td className="px-6 py-3 text-right">
              <em>{EVALUATED_TOTAL.toLocaleString()}</em>
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

export function ReleaseStabilityTable() {
  const PCT = 100;
  return (
    <div className="my-6 overflow-x-auto">
      <table className={tableWrap}>
        <thead className={theadCls}>
          <tr>
            <th className="px-6 py-3 font-medium">Stability band</th>
            <th className="px-6 py-3 text-right font-medium">Shows</th>
            <th className="px-6 py-3 text-right font-medium">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/35">
          {STABILITY_BANDS.map((band) => {
            const share = ((band.shows / EVALUATED_TOTAL) * PCT).toFixed(
              DECIMALS
            );
            return (
              <tr key={band.id}>
                <td className="px-6 py-3">{band.label}</td>
                <td className="px-6 py-3 text-right">{band.shows}</td>
                <td className="px-6 py-3 text-right">{share}%</td>
              </tr>
            );
          })}
          <tr>
            <td className="px-6 py-3">
              <em>Total</em>
            </td>
            <td className="px-6 py-3 text-right">
              <em>{EVALUATED_TOTAL.toLocaleString()}</em>
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
