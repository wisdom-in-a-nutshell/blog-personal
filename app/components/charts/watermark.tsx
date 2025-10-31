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
          "pointer-events-none mt-3 flex justify-end text-[10px] font-medium tracking-[0.08em] text-muted-foreground/65",
          "max-sm:justify-center max-sm:text-[9px] max-sm:tracking-[0.06em]",
          className
        )}
      >
        <span>{text}</span>
      </div>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none text-[10px] font-medium tracking-[0.08em] text-muted-foreground/55",
        "absolute bottom-3 right-4",
        "max-sm:bottom-2 max-sm:right-3 max-sm:text-[9px] max-sm:tracking-[0.06em]",
        className
      )}
    >
      {text}
    </span>
  )
}
