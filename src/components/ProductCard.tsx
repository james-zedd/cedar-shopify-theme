"use client";

import Link from "next/link";
import { Image, Money } from "@shopify/hydrogen-react";
import type { CollectionProduct } from "@/lib/queries/collection";

type ProductCardProps = {
  product: CollectionProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange } = product;

  return (
    <Link href={`/products/${handle}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        {featuredImage && (
          <Image
            data={featuredImage}
            alt={featuredImage.altText ?? title}
            aspectRatio="1/1"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="mt-3 text-sm font-medium">{title}</h3>
      <Money
        as="p"
        data={priceRange.minVariantPrice}
        className="mt-1 text-sm text-gray-500"
      />
    </Link>
  );
}