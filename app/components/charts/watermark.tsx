"use client"

import { cn } from "@/lib/utils"

export type ChartWatermarkProps = {
  /**
   * Text rendered as the watermark signature.
   */
  text: string
  /**
   * Overlay puts the watermark on top of the chart, inline renders it below the chart area.
   */
  variant?: "overlay" | "inline"
  /**
   * Optional className overrides for custom placement.
   */
  className?: string
}

export function ChartWatermark({
  text,
  variant = "overlay",
  className,
}: ChartWatermarkProps) {
  if (!text) {
    return null
  }

  if (variant === "inline") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none mt-3 flex justify-end text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/45",
          "max-sm:justify-center max-sm:text-[9px] max-sm:tracking-[0.1em]",
          className
        )}
      >
        <span className="rounded-full bg-background/75 px-3 py-1 shadow-sm backdrop-blur">
          {text}
        </span>
      </div>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/45",
        "absolute bottom-3 right-4 rounded-full bg-background/75 px-3 py-1 shadow-sm backdrop-blur",
        "max-sm:bottom-2 max-sm:right-3 max-sm:text-[9px] max-sm:tracking-[0.1em]",
        className
      )}
    >
      {text}
    </span>
  )
}
