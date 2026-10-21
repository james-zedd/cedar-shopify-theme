import { afterEach, describe, expect, it, vi } from "vitest";
import { shopifyFetch } from "@/lib/shopify";
import { getCollection, getCollectionSeo, getCollections } from "../collection";
import { makeCollectionSummary, makeProduct } from "@/components/__tests__/_fixtures";

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

describe("getCollection", () => {
  afterEach(() => {
    mockShopifyFetch.mockReset();
  });

  it("requests the first page of 12 products by default", async () => {
    mockShopifyFetch.mockResolvedValue({ collection: null });

    await getCollection("jokes-for-kids");

    expect(mockShopifyFetch).toHaveBeenCalledWith(
      expect.stringContaining("collection(handle: $handle)"),
      { handle: "jokes-for-kids", first: 12, after: undefined, filters: undefined },
    );
  });

  it("pages forward from the after cursor", async () => {
    mockShopifyFetch.mockResolvedValue({ collection: null });

    await getCollection("jokes-for-kids", { pageSize: 6, after: "cursor-1" });

    expect(mockShopifyFetch).toHaveBeenCalledWith(expect.any(String), {
      handle: "jokes-for-kids",
      first: 6,
      after: "cursor-1",
      filters: undefined,
    });
  });

  it("pages backward from the before cursor", async () => {
    mockShopifyFetch.mockResolvedValue({ collection: null });

    await getCollection("jokes-for-kids", { before: "cursor-2" });

    expect(mockShopifyFetch).toHaveBeenCalledWith(expect.any(String), {
      handle: "jokes-for-kids",
      last: 12,
      before: "cursor-2",
      filters: undefined,
    });
  });

  it("filters to available products when asked", async () => {
    mockShopifyFetch.mockResolvedValue({ collection: null });

    await getCollection("jokes-for-kids", { availableOnly: true });

    expect(mockShopifyFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ filters: [{ available: true }] }),
    );
  });

  it("returns the collection with its products and page info", async () => {
    const collection = {
      id: "gid://shopify/Collection/2",
      title: "Jokes for Kids",
      products: {
        nodes: [makeProduct()],
        pageInfo: { hasNextPage: true, hasPreviousPage: false, startCursor: "a", endCursor: "b" },
      },
    };
    mockShopifyFetch.mockResolvedValue({ collection });

    expect(await getCollection("jokes-for-kids")).toEqual(collection);
  });

  it("returns null when no collection has the handle", async () => {
    mockShopifyFetch.mockResolvedValue({ collection: null });

    expect(await getCollection("missing")).toBeNull();
  });
});

describe("getCollectionSeo", () => {
  afterEach(() => {
    mockShopifyFetch.mockReset();
  });

  it("requests the collection's SEO fields by handle", async () => {
    mockShopifyFetch.mockResolvedValue({ collection: null });

    await getCollectionSeo("jokes-for-kids");

    const [query, variables] = mockShopifyFetch.mock.calls[0];
    expect(query).toContain("query CollectionSeoQuery");
    expect(query).toContain("seo {");
    expect(variables).toEqual({ handle: "jokes-for-kids" });
  });

  it("returns the collection's SEO data", async () => {
    const collection = {
      handle: "jokes-for-kids",
      title: "Jokes for Kids",
      description: "Clean jokes for young readers.",
      seo: { title: null, description: null },
      image: null,
    };
    mockShopifyFetch.mockResolvedValue({ collection });

    expect(await getCollectionSeo("jokes-for-kids")).toEqual(collection);
  });

  it("returns null when no collection has the handle", async () => {
    mockShopifyFetch.mockResolvedValue({ collection: null });

    expect(await getCollectionSeo("missing")).toBeNull();
  });
});
