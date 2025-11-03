"use client";

import { cn } from "@/lib/utils";

export type ChartWatermarkProps = {
  /**
   * Text rendered as the watermark signature.
   */
  text: string;
  /**
   * Overlay puts the watermark on top of the chart, inline renders it below the chart area.
   */
  variant?: "overlay" | "inline";
  /**
   * Optional className overrides for custom placement.
   */
  className?: string;
};

export function ChartWatermark({
  text,
  variant = "overlay",
  className,
}: ChartWatermarkProps) {
  if (!text) {
    return null;
  }

  if (variant === "inline") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none mt-3 flex justify-end font-medium text-[10px] text-muted-foreground/65 tracking-[0.08em]",
          "max-sm:justify-center max-sm:text-[9px] max-sm:tracking-[0.06em]",
          className
        )}
      >
        <span>{text}</span>
      </div>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none font-medium text-[10px] text-muted-foreground/55 tracking-[0.08em]",
        "absolute right-4 bottom-3",
        "max-sm:right-3 max-sm:bottom-2 max-sm:text-[9px] max-sm:tracking-[0.06em]",
        className
      )}
    >
      {text}
    </span>
  );
}
