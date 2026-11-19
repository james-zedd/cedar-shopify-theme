import { afterEach, describe, expect, it, vi } from "vitest";
import { shopifyFetch } from "@/lib/shopify";
import { getPredictiveSearch, getSearchResults } from "../search";
import { makeProduct } from "@/components/__tests__/_fixtures";

vi.mock("@/lib/shopify", () => ({
  shopifyFetch: vi.fn(),
}));

const mockShopifyFetch = vi.mocked(shopifyFetch);

const emptyResults = { predictiveSearch: { products: [], collections: [] } };

describe("getPredictiveSearch", () => {
  afterEach(() => {
    mockShopifyFetch.mockReset();
  });

  it("searches products and collections, 4 of each by default", async () => {
    mockShopifyFetch.mockResolvedValue(emptyResults);

    await getPredictiveSearch("jokes");

    const [query, variables] = mockShopifyFetch.mock.calls[0];
    expect(query).toContain("query PredictiveSearchQuery");
    expect(query).toContain("types: [PRODUCT, COLLECTION]");
    expect(query).toContain("limitScope: EACH");
    expect(query).toContain("fragment CollectionProductFields on Product");
    expect(variables).toEqual({ query: "jokes", limit: 4 });
  });

  it("passes a custom limit", async () => {
    mockShopifyFetch.mockResolvedValue(emptyResults);

    await getPredictiveSearch("jokes", { limit: 6 });

    expect(mockShopifyFetch.mock.calls[0][1]).toEqual({ query: "jokes", limit: 6 });
  });

  it("passes the abort signal to the fetch", async () => {
    mockShopifyFetch.mockResolvedValue(emptyResults);
    const { signal } = new AbortController();

    await getPredictiveSearch("jokes", { signal });

    expect(mockShopifyFetch.mock.calls[0][2]).toEqual({ signal });
  });

  it("returns the matching products and collections", async () => {
    const products = [makeProduct()];
    const collections = [{ id: "gid://shopify/Collection/2", handle: "jokes-for-kids", title: "Jokes for Kids" }];
    mockShopifyFetch.mockResolvedValue({ predictiveSearch: { products, collections } });

    expect(await getPredictiveSearch("jokes")).toEqual({ products, collections });
  });

  it("leaves out Shopify's default frontpage collection", async () => {
    mockShopifyFetch.mockResolvedValue({
      predictiveSearch: {
        products: [],
        collections: [
          { id: "gid://shopify/Collection/1", handle: "frontpage", title: "Home page" },
          { id: "gid://shopify/Collection/2", handle: "jokes-for-kids", title: "Jokes for Kids" },
        ],
      },
    });

    const { collections } = await getPredictiveSearch("jokes");

    expect(collections.map((collection) => collection.handle)).toEqual(["jokes-for-kids"]);
  });

  it("returns empty lists when the API returns no result", async () => {
    mockShopifyFetch.mockResolvedValue({ predictiveSearch: null });

    expect(await getPredictiveSearch("jokes")).toEqual({ products: [], collections: [] });
  });

  it("passes on errors from the Storefront API", async () => {
    mockShopifyFetch.mockRejectedValue(new Error("Storefront API error"));

    await expect(getPredictiveSearch("jokes")).rejects.toThrow("Storefront API error");
  });
});

const pageInfo = { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null };

describe("getSearchResults", () => {
  afterEach(() => {
    mockShopifyFetch.mockReset();
  });

  it("searches products only, 12 per page by default", async () => {
    mockShopifyFetch.mockResolvedValue({ search: { totalCount: 0, nodes: [], pageInfo } });

    await getSearchResults("jokes");

    const [query, variables] = mockShopifyFetch.mock.calls[0];
    expect(query).toContain("query SearchQuery");
    expect(query).toContain("types: [PRODUCT]");
    expect(query).toContain("totalCount");
    expect(query).toContain("fragment CollectionProductFields on Product");
    expect(variables).toEqual({ query: "jokes", first: 12, after: undefined });
  });

  it("pages forward with an after cursor", async () => {
    mockShopifyFetch.mockResolvedValue({ search: { totalCount: 0, nodes: [], pageInfo } });

    await getSearchResults("jokes", { pageSize: 4, after: "cursor-1" });

    expect(mockShopifyFetch.mock.calls[0][1]).toEqual({ query: "jokes", first: 4, after: "cursor-1" });
  });

  it("pages backward with a before cursor", async () => {
    mockShopifyFetch.mockResolvedValue({ search: { totalCount: 0, nodes: [], pageInfo } });

    await getSearchResults("jokes", { pageSize: 4, before: "cursor-1" });

    expect(mockShopifyFetch.mock.calls[0][1]).toEqual({ query: "jokes", last: 4, before: "cursor-1" });
  });

  it("returns the total count, products and page info", async () => {
    const products = [makeProduct()];
    const morePages = { ...pageInfo, hasNextPage: true, endCursor: "cursor-1" };
    mockShopifyFetch.mockResolvedValue({ search: { totalCount: 7, nodes: products, pageInfo: morePages } });

    expect(await getSearchResults("jokes")).toEqual({ totalCount: 7, products, pageInfo: morePages });
  });

  it("passes on errors from the Storefront API", async () => {
    mockShopifyFetch.mockRejectedValue(new Error("Storefront API error"));

    await expect(getSearchResults("jokes")).rejects.toThrow("Storefront API error");
  });
});
