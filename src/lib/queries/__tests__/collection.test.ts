import { afterEach, describe, expect, it, vi } from "vitest";
import { shopifyFetch } from "@/lib/shopify";
import { getCollections } from "../collection";
import { makeCollectionSummary } from "@/components/__tests__/_fixtures";

vi.mock("@/lib/shopify", () => ({
  shopifyFetch: vi.fn(),
}));

const mockShopifyFetch = vi.mocked(shopifyFetch);

describe("getCollections", () => {
  afterEach(() => {
    mockShopifyFetch.mockReset();
  });

  it("requests collections with 4 products each by default", async () => {
    mockShopifyFetch.mockResolvedValue({ collections: { nodes: [] } });

    await getCollections();

    expect(mockShopifyFetch).toHaveBeenCalledWith(
      expect.stringContaining("collections(first: $first)"),
      { first: 50, productsFirst: 4 },
    );
  });

  it("includes the shared product fields fragment in the query", async () => {
    mockShopifyFetch.mockResolvedValue({ collections: { nodes: [] } });

    await getCollections();

    const [query] = mockShopifyFetch.mock.calls[0];
    expect(query).toContain("...CollectionProductFields");
    expect(query).toContain("fragment CollectionProductFields on Product");
  });

  it("passes a custom number of products per collection", async () => {
    mockShopifyFetch.mockResolvedValue({ collections: { nodes: [] } });

    await getCollections({ productsPerCollection: 8 });

    expect(mockShopifyFetch).toHaveBeenCalledWith(expect.any(String), { first: 50, productsFirst: 8 });
  });

  it("returns collections in the order Shopify sends them", async () => {
    const collections = [
      makeCollectionSummary({ id: "gid://shopify/Collection/1", handle: "jokes-for-men-40" }),
      makeCollectionSummary({ id: "gid://shopify/Collection/2", handle: "jokes-for-kids" }),
    ];
    mockShopifyFetch.mockResolvedValue({ collections: { nodes: collections } });

    expect(await getCollections()).toEqual(collections);
  });

  it("leaves out Shopify's default frontpage collection", async () => {
    mockShopifyFetch.mockResolvedValue({
      collections: {
        nodes: [
          makeCollectionSummary({ id: "gid://shopify/Collection/1", handle: "frontpage", title: "Home page" }),
          makeCollectionSummary({ id: "gid://shopify/Collection/2", handle: "jokes-for-kids" }),
        ],
      },
    });

    const collections = await getCollections();

    expect(collections.map((collection) => collection.handle)).toEqual(["jokes-for-kids"]);
  });

  it("passes on errors from the Storefront API", async () => {
    mockShopifyFetch.mockRejectedValue(new Error("Storefront API error"));

    await expect(getCollections()).rejects.toThrow("Storefront API error");
  });
});
