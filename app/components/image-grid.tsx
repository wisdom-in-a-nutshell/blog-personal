import Image from "next/image";
import type React from "react";

type ImageGridProps = {
  images: {
    src: string;
    alt: string;
    href?: string;
  }[];
  columns?: 2 | 3 | 4; // Accepts 2, 3, or 4 columns
};

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 3,
}) => {
  const gridClass = {
    2: "grid-cols-2 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];

  return (
    <section>
      <div className={`grid ${gridClass} my-8 gap-4`}>
        {images.map((image) => (
          <div className="relative aspect-square" key={image.href ?? image.src}>
            {image.href ? (
              <a
                className="block h-full w-full"
                href={image.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Image
                  alt={image.alt}
                  className="rounded-lg object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, 33vw"
                  src={image.src}
                />
              </a>
            ) : (
              <Image
                alt={image.alt}
                className="rounded-lg object-cover"
                fill
                priority
                sizes="(max-width: 768px) 50vw, 33vw"
                src={image.src}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
