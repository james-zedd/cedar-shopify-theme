import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { redirect } from "next/navigation";
import { getSearchResults, type SearchResults } from "@/lib/queries/search";
import { getCollections } from "@/lib/queries/collection";
import SearchPage, { generateMetadata } from "../page";
import { makeCollectionSummary, makeProduct } from "@/components/__tests__/_fixtures";

// next/form needs a mounted app router; a plain form is enough to check its markup.
vi.mock("next/form", () => ({
  default: (props: ComponentProps<"form">) => <form {...props} />,
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("@/lib/queries/search", () => ({
  getSearchResults: vi.fn(),
}));

vi.mock("@/lib/queries/collection", () => ({
  getCollections: vi.fn(),
}));

const mockGetSearchResults = vi.mocked(getSearchResults);
const mockGetCollections = vi.mocked(getCollections);
const mockRedirect = vi.mocked(redirect);

const onePage = { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null };

function makeResults(overrides: Partial<SearchResults> = {}): SearchResults {
  const products = [1, 2, 3].map((n) =>
    makeProduct({ id: `gid://shopify/Product/${n}`, handle: `product-${n}`, title: `Dad Jokes Vol. ${n}` }),
  );
  return { totalCount: products.length, products, pageInfo: onePage, ...overrides };
}

function pageProps(searchParams: Record<string, string | string[]>) {
  return { params: Promise.resolve({}), searchParams: Promise.resolve(searchParams) } as PageProps<"/search">;
}

async function renderSearch(searchParams: Record<string, string | string[]>) {
  render(await SearchPage(pageProps(searchParams)));
}

describe("Search page", () => {
  afterEach(() => {
    cleanup();
    mockGetSearchResults.mockReset();
    mockGetCollections.mockReset();
    mockRedirect.mockClear();
  });

  it("renders the results for a query with a count", async () => {
    mockGetSearchResults.mockResolvedValue(makeResults());

    await renderSearch({ q: "dad jokes" });

    expect(mockGetSearchResults).toHaveBeenCalledWith("dad jokes", { pageSize: 12, after: undefined, before: undefined });
    expect(screen.getByRole("heading", { level: 1, name: "Search results for “dad jokes”" })).toBeDefined();
    expect(screen.getByText("3 results")).toBeDefined();

    const results = screen.getByRole("region", { name: "Search results" });
    expect(within(results).getAllByRole("listitem")).toHaveLength(3);
    expect(within(results).getByRole("heading", { name: "Dad Jokes Vol. 1" })).toBeDefined();
  });

  it("uses the singular for one result", async () => {
    mockGetSearchResults.mockResolvedValue(makeResults({ totalCount: 1, products: [makeProduct()] }));

    await renderSearch({ q: "dad" });

    expect(screen.getByText("1 result")).toBeDefined();
  });

  it("trims the query and keeps it in the search form", async () => {
    mockGetSearchResults.mockResolvedValue(makeResults());

    await renderSearch({ q: "  dad  " });

    expect(mockGetSearchResults.mock.calls[0][0]).toBe("dad");
    const form = screen.getByRole("search");
    expect(form.getAttribute("action")).toBe("/search");
    expect(within(form).getByRole("searchbox", { name: "Search products" })).toHaveProperty("value", "dad");
  });

  it("passes the cursor on and keeps the query in the pagination links", async () => {
    mockGetSearchResults.mockResolvedValue(
      makeResults({
        pageInfo: { hasNextPage: true, hasPreviousPage: true, startCursor: "start", endCursor: "end" },
      }),
    );

    await renderSearch({ q: "dad", after: "cursor-1" });

    expect(mockGetSearchResults).toHaveBeenCalledWith("dad", { pageSize: 12, after: "cursor-1", before: undefined });
    expect(screen.getByRole("link", { name: "Next →" }).getAttribute("href")).toBe("/search?q=dad&after=end");
    expect(screen.getByRole("link", { name: "← Previous" }).getAttribute("href")).toBe("/search?q=dad&before=start");
  });

  it("shows a no-results state with suggestions and collections to browse", async () => {
    mockGetSearchResults.mockResolvedValue(makeResults({ totalCount: 0, products: [] }));
    mockGetCollections.mockResolvedValue([
      makeCollectionSummary({ id: "gid://shopify/Collection/2", handle: "jokes-for-kids", title: "Jokes for Kids" }),
    ]);

    await renderSearch({ q: "xyzzy" });

    expect(screen.getByText("“xyzzy”")).toBeDefined();
    expect(screen.getByText("Check the spelling.")).toBeDefined();
    expect(screen.queryByText(/results?$/)).toBeNull();
    const browse = screen.getByRole("navigation", { name: "Browse our collections" });
    expect(within(browse).getByRole("link", { name: "Jokes for Kids" }).getAttribute("href")).toBe(
      "/collections/jokes-for-kids",
    );
  });

  it("still shows the no-results state when the collections can't be loaded", async () => {
    mockGetSearchResults.mockResolvedValue(makeResults({ totalCount: 0, products: [] }));
    mockGetCollections.mockRejectedValue(new Error("Storefront API error"));

    await renderSearch({ q: "xyzzy" });

    expect(screen.getByText("Check the spelling.")).toBeDefined();
    expect(screen.queryByRole("navigation", { name: "Browse our collections" })).toBeNull();
  });

  it("asks for a search term without calling the API when the query is empty", async () => {
    await renderSearch({ q: "   " });

    expect(mockGetSearchResults).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1, name: "Search" })).toBeDefined();
    expect(screen.getByText("Enter a search term to find products.")).toBeDefined();
    expect(screen.getByRole("searchbox", { name: "Search products" })).toBeDefined();
  });

  it("starts over from the first page when a cursor is rejected", async () => {
    mockGetSearchResults.mockRejectedValue(new Error("Invalid cursor"));

    await expect(SearchPage(pageProps({ q: "dad jokes", after: "bad" }))).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/search?q=dad+jokes");
  });

  it("passes on API errors on the first page", async () => {
    mockGetSearchResults.mockRejectedValue(new Error("Storefront API error"));

    await expect(SearchPage(pageProps({ q: "dad" }))).rejects.toThrow("Storefront API error");
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});

describe("Search page metadata", () => {
  it("names the search term and keeps the page out of search engines", async () => {
    const metadata = await generateMetadata(pageProps({ q: " dad jokes " }));

    expect(metadata.title).toBe("Search results for “dad jokes”");
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("uses a plain title without a search term", async () => {
    const metadata = await generateMetadata(pageProps({}));

    expect(metadata.title).toBe("Search");
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
