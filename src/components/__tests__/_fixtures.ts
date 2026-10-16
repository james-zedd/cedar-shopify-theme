import type { CollectionProduct } from "@/lib/queries/collection";
import type { ProductDetail } from "@/lib/queries/product";
import type { ComponentProps } from "react";
import type { CartProvider } from "@shopify/hydrogen-react";

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
    description: "A very funny book.",
    descriptionHtml: "<p>A very funny book.</p>",
    seo: {
      title: null,
      description: null,
    },
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

export type CartData = NonNullable<ComponentProps<typeof CartProvider>["data"]>;
type CartLineData = NonNullable<NonNullable<CartData["lines"]>["nodes"]>[number];

export function makeCartLine(overrides: Partial<CartLineData> = {}): CartLineData {
  return {
    id: "gid://shopify/CartLine/1",
    quantity: 2,
    attributes: [],
    cost: {
      totalAmount: { amount: "25.98", currencyCode: "USD" },
    },
    merchandise: {
      id: "gid://shopify/ProductVariant/1",
      title: "Paperback",
      image: {
        url: "https://cdn.shopify.com/s/files/front-cover.png",
        altText: "Front cover",
        width: 2048,
        height: 2048,
      },
      product: {
        id: "gid://shopify/Product/1",
        handle: "product-1",
        title: "Product 1",
      },
    },
    ...overrides,
  };
}

export function makeCart(overrides: Partial<CartData> = {}): CartData {
  return {
    id: "gid://shopify/Cart/1",
    checkoutUrl: "https://test-store.myshopify.com/cart/c/1",
    totalQuantity: 3,
    buyerIdentity: { countryCode: "US" },
    lines: {
      nodes: [
        makeCartLine(),
        makeCartLine({
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          cost: { totalAmount: { amount: "19.99", currencyCode: "USD" } },
          merchandise: {
            id: "gid://shopify/ProductVariant/3",
            title: "Default Title",
            product: { id: "gid://shopify/Product/2", handle: "product-2", title: "Product 2" },
          },
        }),
      ],
    },
    cost: {
      subtotalAmount: { amount: "45.97", currencyCode: "USD" },
      totalAmount: { amount: "45.97", currencyCode: "USD" },
    },
    ...overrides,
  };
}