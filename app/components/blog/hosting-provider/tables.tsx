"use client";

import React from "react";

import {
  HOSTING_PROVIDER_DATA,
  type HostingProviderCohort,
} from "@/data/podcasts/hosting-provider";

import { buildAggregateSegments } from "./charts";

const tableWrap =
  "mx-auto w-full max-w-3xl min-w-[28rem] table-fixed overflow-hidden rounded-2xl border border-border/60 bg-card/95 text-sm shadow-sm";
const theadCls =
  "bg-muted/20 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground/80";

type HostingProviderAggregateTableProps = {
  cohort: HostingProviderCohort;
};

export function HostingProviderAggregateTable({
  cohort,
}: HostingProviderAggregateTableProps) {
  const segments = React.useMemo(
    () => buildAggregateSegments(cohort),
    [cohort]
  );
  const totals = HOSTING_PROVIDER_DATA[cohort].totalShows;

  return (
    <div className="my-6 overflow-x-auto">
      <table className={tableWrap}>
        <thead className={theadCls}>
          <tr>
            <th className="px-6 py-3 font-medium">Host</th>
            <th className="px-6 py-3 text-right font-medium">Shows</th>
            <th className="px-6 py-3 text-right font-medium">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/35">
          {segments.map((segment, index) => {
            const highlight =
              index === 0 ? " font-semibold text-foreground" : "";
            return (
              <tr key={segment.id}>
                <td className={`px-6 py-3${highlight}`}>{segment.label}</td>
                <td className={`px-6 py-3 text-right${highlight}`}>
                  {segment.count.toLocaleString()}
                </td>
                <td className={`px-6 py-3 text-right${highlight}`}>
                  {segment.share.toFixed(1)}%
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="px-6 py-3">
              <em>Total</em>
            </td>
            <td className="px-6 py-3 text-right">
              <em>{totals.toLocaleString()}</em>
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

export function HostingProviderTop1KAggregateTable() {
  return <HostingProviderAggregateTable cohort="top1k" />;
}

export function HostingProviderTop10KAggregateTable() {
  return <HostingProviderAggregateTable cohort="top10k" />;
}
