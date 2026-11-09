import { afterEach, describe, expect, it, vi } from "vitest";
import { shopifyFetch } from "@/lib/shopify";
import { getShop } from "../shop";
import { makeShop } from "@/components/__tests__/_fixtures";

vi.mock("@/lib/shopify", () => ({
  shopifyFetch: vi.fn(),
}));

const mockShopifyFetch = vi.mocked(shopifyFetch);

describe("getShop", () => {
  afterEach(() => {
    mockShopifyFetch.mockReset();
  });

  it("requests the shop name and brand fields", async () => {
    mockShopifyFetch.mockResolvedValue({ shop: makeShop() });

    await getShop();

    const [query] = mockShopifyFetch.mock.calls[0];
    expect(query).toContain("query ShopQuery");
    expect(query).toContain("name");
    expect(query).toContain("logo {");
    expect(query).toContain("slogan");
    expect(query).toContain("shortDescription");
    expect(query).toContain("coverImage {");
  });

  it("returns the shop with its brand", async () => {
    const shop = makeShop();
    mockShopifyFetch.mockResolvedValue({ shop });

    expect(await getShop()).toEqual(shop);
  });

  it("returns a shop that has no brand set", async () => {
    const shop = makeShop({ brand: null });
    mockShopifyFetch.mockResolvedValue({ shop });

    expect(await getShop()).toEqual(shop);
  });

  it("passes on errors from the Storefront API", async () => {
    mockShopifyFetch.mockRejectedValue(new Error("Storefront API error"));

    await expect(getShop()).rejects.toThrow("Storefront API error");
  });
});
