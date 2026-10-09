import type { CollectionProduct } from "@/lib/queries/collection";
import type { ProductDetail } from "@/lib/queries/product";

export function makeProduct(overrides: Partial<CollectionProduct> = {}): CollectionProduct {
  return {
    id: "gid://shopify/Product/1",
    handle: "product-1",
    title: "Product 1",
    availableForSale: true,
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

export function makeProductDetail(overrides: Partial<ProductDetail> = {}): ProductDetail {
  return {
    id: "gid://shopify/Product/1",
    handle: "product-1",
    title: "Product 1",
    descriptionHtml: "<p>A very funny book.</p>",
    availableForSale: true,
    images: {
      nodes: [
        {
          id: "gid://shopify/ProductImage/1",
          url: "https://cdn.shopify.com/s/files/front-cover.png",
          altText: "Front cover",
          width: 2048,
          height: 2048,
        },
        {
          id: "gid://shopify/ProductImage/2",
          url: "https://cdn.shopify.com/s/files/back-cover.png",
          altText: "Back cover",
          width: 2048,
          height: 2048,
        },
      ],
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/1",
          title: "Paperback",
          availableForSale: true,
          selectedOptions: [{ name: "Format", value: "Paperback" }],
          price: { amount: "12.99", currencyCode: "USD" },
        },
        {
          id: "gid://shopify/ProductVariant/2",
          title: "Hardcover",
          availableForSale: false,
          selectedOptions: [{ name: "Format", value: "Hardcover" }],
          price: { amount: "19.99", currencyCode: "USD" },
        },
      ],
    },
    metafields: [],
    ...overrides,
  };
}