import { describe, expect, it } from "vitest";
import { sharedOpenGraph, toOpenGraphImages } from "../seo";
import { SITE_NAME } from "../constants";

describe("sharedOpenGraph", () => {
  it("uses the site name, US English locale and website type", () => {
    expect(sharedOpenGraph).toEqual({ siteName: SITE_NAME, locale: "en_US", type: "website" });
  });
});

describe("toOpenGraphImages", () => {
  const image = {
    url: "https://cdn.shopify.com/s/files/book.jpg",
    altText: "Book cover",
    width: 800,
    height: 1200,
  };

  it("returns undefined when there is no image", () => {
    expect(toOpenGraphImages(null, "Fallback")).toBeUndefined();
    expect(toOpenGraphImages(undefined, "Fallback")).toBeUndefined();
  });

  it("maps an image to a single Open Graph image", () => {
    expect(toOpenGraphImages(image, "Fallback")).toEqual([
      { url: image.url, width: 800, height: 1200, alt: "Book cover" },
    ]);
  });

  it("uses the fallback alt text when the image has none", () => {
    expect(toOpenGraphImages({ ...image, altText: null }, "Fallback")?.[0].alt).toBe("Fallback");
    expect(toOpenGraphImages({ ...image, altText: "" }, "Fallback")?.[0].alt).toBe("Fallback");
  });

  it("leaves out missing dimensions", () => {
    const [ogImage] = toOpenGraphImages({ url: image.url, width: null, height: null }, "Fallback")!;

    expect(ogImage.width).toBeUndefined();
    expect(ogImage.height).toBeUndefined();
  });
});
