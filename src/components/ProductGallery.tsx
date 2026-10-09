"use client";

import { useState } from "react";
import { Image } from "@shopify/hydrogen-react";
import type { ProductImage } from "@/lib/queries/product";

type ProductGalleryProps = {
  images: ProductImage[];
  title: string;
};

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!selectedImage) {
    return <div className="aspect-square rounded-lg bg-gray-100" />
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          data={selectedImage}
          alt={selectedImage.altText ?? title}
          aspectRatio="1/1"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-4 grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === selectedIndex}
                className="block aspect-square w-full overflow-hidden rounded border-2 border-transparent aria-[current=true]:border-gray-900"
              >
                <Image
                  data={image}
                  alt=""
                  aria-hidden="true"
                  aspectRatio="1/1"
                  sizes="10vw"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}