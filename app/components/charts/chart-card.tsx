"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { DownloadChartButton } from "./download-chart-button";
import { ChartWatermark } from "./watermark";

type ChartCardProps = {
  title: string;
  description?: string;
  downloadName?: string;
  watermarkVariant?: "overlay" | "inline";
  signature?: string | null;
  watermarkClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function ChartCard({
  title,
  description,
  downloadName,
  watermarkVariant = "overlay",
  signature,
  watermarkClassName,
  children,
  footer,
  className,
}: ChartCardProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <Card
      className={cn("border-border/70 bg-background", className)}
      ref={cardRef}
    >
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle className="font-semibold text-base">{title}</CardTitle>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
        {downloadName ? (
          <DownloadChartButton
            className="sm:mt-0"
            fileName={downloadName}
            filter={(element) =>
              element instanceof Element
                ? !element.hasAttribute("data-chart-download-control")
                : true
            }
            getNode={() => cardRef.current}
            pixelRatio={3}
          />
        ) : null}
      </CardHeader>
      <CardContent className="px-4 pb-6">
        <div className="relative w-full">
          {children}
          {signature ? (
            <ChartWatermark
              className={watermarkClassName}
              text={signature}
              variant={watermarkVariant}
            />
          ) : null}
        </div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
