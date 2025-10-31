"use client"

import * as React from "react"
import { toPng } from "html-to-image"
import { Download } from "lucide-react"

import { cn } from "@/lib/utils"

type DownloadChartButtonProps = {
  /**
   * Getter returning the DOM node that should be exported.
   */
  getNode: () => HTMLElement | null
  /**
   * Filename (without extension) used for downloads.
   */
  fileName?: string
  /**
   * Override the device pixel ratio used for the export.
   */
  pixelRatio?: number
  /**
   * Optional filter to exclude elements from the export.
   */
  filter?: (element: Element) => boolean
  /**
   * Optional callback fired after a successful download.
   */
  onDownload?: () => void
  className?: string
}

export function DownloadChartButton({
  getNode,
  fileName = "chart",
  pixelRatio,
  filter,
  onDownload,
  className,
}: DownloadChartButtonProps) {
  const [downloading, setDownloading] = React.useState(false)
  const handleClick = React.useCallback(async () => {
    const node = getNode()
    if (!node || downloading) {
      return
    }

    try {
      setDownloading(true)
      // Increase resolution a bit for social sharing without blowing up file size.
      const resolvedPixelRatio = pixelRatio ?? Math.max(2, Math.min(window.devicePixelRatio || 2, 3))
      const dataUrl = await toPng(node, {
        pixelRatio: resolvedPixelRatio,
        cacheBust: true,
        skipFonts: false,
        filter,
      })

      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `${fileName}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      onDownload?.()
    } catch (error) {
      console.error("Unable to export chart", error)
    } finally {
      setDownloading(false)
    }
  }, [getNode, fileName, pixelRatio, filter, onDownload, downloading])

  return (
    <button
      type="button"
      data-chart-download-control
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 hover:bg-muted",
        className
      )}
      onClick={handleClick}
      disabled={downloading}
      aria-busy={downloading}
      title={downloading ? "Exporting…" : "Download chart as PNG"}
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      {downloading ? "Exporting…" : "Download"}
    </button>
  )
}
