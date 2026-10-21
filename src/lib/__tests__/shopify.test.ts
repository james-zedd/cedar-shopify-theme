import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STOREFRONT_API_VERSION } from "../constants";

// shopify.ts reads these when it is first imported, so they must be set before the import.
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_STORE_DOMAIN = "cedar-test.myshopify.com";
  process.env.NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN = "test-token";
});

import { shopifyFetch } from "../shopify";

const mockFetch = vi.fn();

function respondWith(body: unknown) {
  mockFetch.mockResolvedValue({ json: () => Promise.resolve(body) });
}

describe("shopifyFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    mockFetch.mockReset();
    vi.unstubAllGlobals();
  });

  it("posts the query and variables to the store's Storefront API", async () => {
    respondWith({ data: {} });

    await shopifyFetch("query { shop { name } }", { handle: "jokes-for-kids" });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`https://cedar-test.myshopify.com/api/${STOREFRONT_API_VERSION}/graphql.json`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      query: "query { shop { name } }",
      variables: { handle: "jokes-for-kids" },
    });
  });

  it("sends the public storefront token", async () => {
    respondWith({ data: {} });

    await shopifyFetch("query { shop { name } }");

    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers["X-Shopify-Storefront-Access-Token"]).toBe("test-token");
    expect(init.headers["content-type"]).toBe("application/json");
  });

  it("returns the data from the response", async () => {
    respondWith({ data: { shop: { name: "Cedar" } } });

    expect(await shopifyFetch("query { shop { name } }")).toEqual({ shop: { name: "Cedar" } });
  });

  it("throws the GraphQL errors when the response has any", async () => {
    const errors = [{ message: "Field 'nope' doesn't exist on type 'Shop'" }];
    respondWith({ errors });

    await expect(shopifyFetch("query { shop { nope } }")).rejects.toThrow(JSON.stringify(errors));
  });

  it("passes on network errors", async () => {
    mockFetch.mockRejectedValue(new TypeError("fetch failed"));

    await expect(shopifyFetch("query { shop { name } }")).rejects.toThrow("fetch failed");
  });
});
