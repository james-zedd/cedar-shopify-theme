"use client";

import { Money, ProductProvider, useProduct } from "@shopify/hydrogen-react";
import type { ProductDetail } from "@/lib/queries/product";

type ProductDetailsProps = {
  product: ProductDetail;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <ProductProvider data={product}>
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <SelectedVariantPrice />
    </ProductProvider>
  );
}

function SelectedVariantPrice() {
  const { selectedVariant } = useProduct();

  if (!selectedVariant?.price) {
    return null;
  }

  return <Money as="p" data={selectedVariant.price} className="mt-2 text-xl" />;
}