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
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{product.title}</h1>
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
      className="mt-8 w-full rounded bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity border disabled:border-primary hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:opacity-100"
    >
      {isAvailable ? "Add to cart" : "Sold out"}
    </AddToCartButton>
  );
}