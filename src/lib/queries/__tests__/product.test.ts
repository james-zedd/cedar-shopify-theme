import { afterEach, describe, expect, it, vi } from "vitest";
import { shopifyFetch } from "@/lib/shopify";
import { getProduct } from "../product";
import { makeProductDetail } from "@/components/__tests__/_fixtures";

vi.mock("@/lib/shopify", () => ({
  shopifyFetch: vi.fn(),
}));

const mockShopifyFetch = vi.mocked(shopifyFetch);

describe("getProduct", () => {
  afterEach(() => {
    mockShopifyFetch.mockReset();
  });

  it("requests the product by handle", async () => {
    mockShopifyFetch.mockResolvedValue({ product: null });

    await getProduct("dad-jokes-vol-1");

    expect(mockShopifyFetch).toHaveBeenCalledWith(
      expect.stringContaining("product(handle: $handle)"),
      { handle: "dad-jokes-vol-1" },
    );
  });

  it("asks for the author and page count metafields", async () => {
    mockShopifyFetch.mockResolvedValue({ product: null });

    await getProduct("dad-jokes-vol-1");

    const [query] = mockShopifyFetch.mock.calls[0];
    expect(query).toContain('{ namespace: "custom", key: "author" }');
    expect(query).toContain('{ namespace: "custom", key: "page_count" }');
  });

  it("returns the product", async () => {
    const product = makeProductDetail();
    mockShopifyFetch.mockResolvedValue({ product });

    expect(await getProduct(product.handle)).toEqual(product);
  });

  it("returns null when no product has the handle", async () => {
    mockShopifyFetch.mockResolvedValue({ product: null });

    expect(await getProduct("missing")).toBeNull();
  });

  it("passes on errors from the Storefront API", async () => {
    mockShopifyFetch.mockRejectedValue(new Error("Storefront API error"));

    await expect(getProduct("dad-jokes-vol-1")).rejects.toThrow("Storefront API error");
  });
});
