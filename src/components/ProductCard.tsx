"use client";

import Link from "next/link";
import { Money } from "@shopify/hydrogen-react";
import Image from "next/image";
import type { CollectionProduct } from "@/lib/queries/collection";

type ProductCardProps = {
  product: CollectionProduct;
  aboveTheFold?: boolean;
};

export default function ProductCard({ product, aboveTheFold = false }: ProductCardProps) {
  const { handle, title, availableForSale, featuredImage, priceRange } = product;

  return (
    <Link href={`/products/${handle}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {featuredImage && (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            fill
            loading={aboveTheFold ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {!availableForSale && (
          <span className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Sold out</span>
        )}
      </div>
      <h3 className="mt-3 text-sm font-medium">{title}</h3>
      <Money
        as="p"
        data={priceRange.minVariantPrice}
        className="mt-1 text-sm text-muted-foreground"
      />
    </Link>
  );
}