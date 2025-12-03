"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BRAND_COUNT,
  BRAND_STORES,
  type Brand,
} from "@/data/brands/brand-stores";

/** Number of images to prioritize for LCP optimization */
const PRIORITY_IMAGE_COUNT = 6;

type BrandCardProps = {
  brand: Brand;
  priority?: boolean;
};

function BrandCard({ brand, priority = false }: BrandCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      className="group block overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      href={brand.imageUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="relative aspect-[2/3] w-full">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <span className="text-neutral-400 text-sm">{brand.name}</span>
          </div>
        ) : (
          <Image
            alt={`Chibi-style miniature concept store of ${brand.name}`}
            className="rounded-xl object-cover"
            fill
            onError={() => setImageError(true)}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={brand.imageUrl}
            unoptimized
          />
        )}
      </div>
    </a>
  );
}

export function BrandStoreGallery() {
  return (
    <div className="my-12">
      {/* Subtitle */}
      <p className="mb-6 text-center text-neutral-500 text-sm dark:text-neutral-400">
        {BRAND_COUNT} brands · Click to view full resolution
      </p>

      {/* Grid - 2 cols on mobile, 3 on larger screens */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {BRAND_STORES.map((brand, index) => (
          <BrandCard
            brand={brand}
            key={brand.slug}
            priority={index < PRIORITY_IMAGE_COUNT}
          />
        ))}
      </div>
    </div>
  );
}
