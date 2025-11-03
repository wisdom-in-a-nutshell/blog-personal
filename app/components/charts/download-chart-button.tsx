"use client";

import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

type DownloadChartButtonProps = {
  /**
   * Getter returning the DOM node that should be exported.
   */
  getNode: () => HTMLElement | null;
  /**
   * Filename (without extension) used for downloads.
   */
  fileName?: string;
  /**
   * Override the device pixel ratio used for the export.
   */
  pixelRatio?: number;
  /**
   * Optional filter to exclude elements from the export.
   */
  filter?: (element: Element) => boolean;
  /**
   * Optional callback fired after a successful download.
   */
  onDownload?: () => void;
  className?: string;
};

export function DownloadChartButton({
  getNode,
  fileName = "chart",
  pixelRatio,
  filter,
  onDownload,
  className,
}: DownloadChartButtonProps) {
  const [downloading, setDownloading] = React.useState(false);
  const handleClick = React.useCallback(async () => {
    const node = getNode();
    if (!node || downloading) {
      return;
    }

    try {
      setDownloading(true);
      // Increase resolution a bit for social sharing without blowing up file size.
      const MIN_RATIO = 2;
      const MAX_RATIO = 3;
      const resolvedPixelRatio =
        pixelRatio ??
        Math.max(
          MIN_RATIO,
          Math.min(window.devicePixelRatio || MIN_RATIO, MAX_RATIO)
        );
      const dataUrl = await toPng(node, {
        pixelRatio: resolvedPixelRatio,
        cacheBust: true,
        skipFonts: false,
        filter,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onDownload?.();
    } catch (_error) {
      // Best-effort download only; ignore export failures to avoid breaking UX.
    } finally {
      setDownloading(false);
    }
  }, [getNode, fileName, pixelRatio, filter, onDownload, downloading]);

  return (
    <button
      aria-busy={downloading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 font-medium text-foreground text-xs shadow-sm transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      data-chart-download-control
      disabled={downloading}
      onClick={handleClick}
      title={downloading ? "Exporting…" : "Download chart as PNG"}
      type="button"
    >
      <Download aria-hidden="true" className="h-3.5 w-3.5" />
      {downloading ? "Exporting…" : "Download"}
    </button>
  );
}
