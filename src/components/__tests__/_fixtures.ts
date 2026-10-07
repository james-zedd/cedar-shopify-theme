import type { CollectionProduct } from "@/lib/queries/collection";

export function makeProduct(overrides: Partial<CollectionProduct> = {}): CollectionProduct {
  return {
    id: "gid://shopify/Product/1",
    handle: "product-1",
    title: "Product 1",
    featuredImage: {
      url: "https://cdn.shopify.com/s/files/joke-book-cover.png",
      altText: "Product 1 Image",
      width: 2048,
      height: 2048,
    },
    priceRange: {
      minVariantPrice: {
        amount: "10.00",
        currencyCode: "USD",
      },
      maxVariantPrice: {
        amount: "20.00",
        currencyCode: "USD",
      },
    },
    ...overrides,
  };
}