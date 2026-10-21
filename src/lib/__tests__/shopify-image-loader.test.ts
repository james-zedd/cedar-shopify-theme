import { describe, expect, it } from "vitest";
import shopifyImageLoader from "../shopify-image-loader";

describe("shopifyImageLoader", () => {
  const src = "https://cdn.shopify.com/s/files/1/0001/book.jpg";

  it("adds the requested width to the Shopify CDN URL", () => {
    expect(shopifyImageLoader({ src, width: 640 })).toBe(`${src}?width=640`);
  });

  it("keeps existing query parameters", () => {
    expect(shopifyImageLoader({ src: `${src}?v=123`, width: 640 })).toBe(`${src}?v=123&width=640`);
  });

  it("replaces a width that is already set", () => {
    expect(shopifyImageLoader({ src: `${src}?width=2048`, width: 384 })).toBe(`${src}?width=384`);
  });

  it("ignores quality, which Shopify's CDN does not use here", () => {
    expect(shopifyImageLoader({ src, width: 640, quality: 75 })).toBe(`${src}?width=640`);
  });
});
