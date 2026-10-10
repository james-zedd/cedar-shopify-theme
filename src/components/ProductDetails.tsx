"use client";

import { AddToCartButton, Money, ProductProvider, useProduct } from "@shopify/hydrogen-react";
import type { ProductDetail } from "@/lib/queries/product";
import VariantSelector from "@/components/VariantSelector";

type ProductDetailsProps = {
  product: ProductDetail;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <ProductProvider data={product}>
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <SelectedVariantPrice />
      <div className="mt-6">
        <VariantSelector />
      </div>
      <SelectedVariantAddToCart />
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

function SelectedVariantAddToCart() {
  const { selectedVariant } = useProduct();
  const isAvailable = selectedVariant?.availableForSale ?? false;

  return (
    <AddToCartButton
      variantId={selectedVariant?.id}
      disabled={!isAvailable}
      accessibleAddingToCartLabel="Adding item to your cart"
      className="mt-6 w-full rounded bg-gray-900 px-6 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      {isAvailable ? "Add to cart" : "Sold out"}
    </AddToCartButton>
  );
}