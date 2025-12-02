"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CITY_COUNT,
  type City,
  WORLD_CITIES,
} from "@/data/cities/world-cities";

/** Number of images to prioritize for LCP optimization */
const PRIORITY_IMAGE_COUNT = 6;

type CityCardProps = {
  city: City;
  priority?: boolean;
};

function CityCard({ city, priority = false }: CityCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      className="group block overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      href={city.imageUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="relative aspect-square w-full">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <span className="text-neutral-400 text-sm">{city.name}</span>
          </div>
        ) : (
          <Image
            alt={`3D isometric illustration of ${city.name}, ${city.country}`}
            className="rounded-xl object-cover"
            fill
            onError={() => setImageError(true)}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={city.imageUrl}
            unoptimized
          />
        )}
      </div>
    </a>
  );
}

export function CityGallery() {
  return (
    <div className="my-12">
      {/* Subtitle */}
      <p className="mb-6 text-center text-neutral-500 text-sm dark:text-neutral-400">
        {CITY_COUNT} cities · Click to view full resolution
      </p>

      {/* Clean grid - 1 col on mobile, 2 on larger screens */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {WORLD_CITIES.map((city, index) => (
          <CityCard
            city={city}
            key={city.slug}
            priority={index < PRIORITY_IMAGE_COUNT}
          />
        ))}
      </div>
    </div>
  );
}
