import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getPredictiveSearch } from "@/lib/queries/search";
import PredictiveSearch, { SEARCH_DEBOUNCE_MS } from "../PredictiveSearch";
import { makeProduct } from "./_fixtures";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/queries/search", () => ({
  getPredictiveSearch: vi.fn(),
}));

const mockGetPredictiveSearch = vi.mocked(getPredictiveSearch);

const results = {
  products: [
    makeProduct({ id: "gid://shopify/Product/1", handle: "jokes-for-dads", title: "101 Jokes for Dads" }),
    makeProduct({ id: "gid://shopify/Product/2", handle: "jokes-for-kids-book", title: "101 Jokes for Kids" }),
  ],
  collections: [{ id: "gid://shopify/Collection/1", handle: "jokes-for-kids", title: "Jokes for Kids" }],
};

function input() {
  return screen.getByRole("combobox", { name: "Search" });
}

function type(value: string) {
  fireEvent.change(input(), { target: { value } });
}

// Lets the debounce run out and the search promise settle.
async function waitForDebounce(ms = SEARCH_DEBOUNCE_MS) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

async function search(value: string) {
  type(value);
  await waitForDebounce();
}

function activeOption() {
  const id = input().getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
}

describe("PredictiveSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockGetPredictiveSearch.mockResolvedValue(results);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    mockGetPredictiveSearch.mockReset();
    mockPush.mockReset();
  });

  it("is a collapsed combobox to start with", () => {
    render(<PredictiveSearch />);

    expect(input().getAttribute("aria-expanded")).toBe("false");
    expect(input().getAttribute("aria-autocomplete")).toBe("list");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("shows suggestions only after the debounce", async () => {
    render(<PredictiveSearch />);

    type("jokes");
    await waitForDebounce(SEARCH_DEBOUNCE_MS - 1);

    expect(mockGetPredictiveSearch).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).toBeNull();

    await waitForDebounce(1);

    expect(mockGetPredictiveSearch).toHaveBeenCalledWith("jokes", { signal: expect.any(AbortSignal) });
    expect(input().getAttribute("aria-expanded")).toBe("true");
    expect(input().getAttribute("aria-controls")).toBe(screen.getByRole("listbox").id);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("searches once for the final term when typing quickly", async () => {
    render(<PredictiveSearch />);

    type("jo");
    await waitForDebounce(100);
    type("jokes");
    await waitForDebounce();

    expect(mockGetPredictiveSearch).toHaveBeenCalledTimes(1);
    expect(mockGetPredictiveSearch).toHaveBeenCalledWith("jokes", expect.anything());
  });

  it("doesn't search for a single character", async () => {
    render(<PredictiveSearch />);

    await search("j");

    expect(mockGetPredictiveSearch).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("links products with their thumbnail, title and price", async () => {
    render(<PredictiveSearch />);

    await search("jokes");

    const products = screen.getByRole("group", { name: "Products" });
    const option = screen.getByRole("option", { name: /101 Jokes for Dads/ });
    expect(products.contains(option)).toBe(true);
    expect(option.getAttribute("href")).toBe("/products/jokes-for-dads");
    expect(option.textContent).toContain("$10.00");
    expect(option.querySelector("img")?.getAttribute("src")).toContain("joke-book-cover.png");
  });

  it("links matching collections", async () => {
    render(<PredictiveSearch />);

    await search("jokes");

    const collections = screen.getByRole("group", { name: "Collections" });
    const option = screen.getByRole("option", { name: "Jokes for Kids" });
    expect(collections.contains(option)).toBe(true);
    expect(option.getAttribute("href")).toBe("/collections/jokes-for-kids");
  });

  it("moves the active option with the arrow keys", async () => {
    render(<PredictiveSearch />);
    await search("jokes");

    expect(activeOption()).toBeNull();

    fireEvent.keyDown(input(), { key: "ArrowDown" });
    expect(activeOption()?.textContent).toContain("101 Jokes for Dads");
    expect(activeOption()?.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(input(), { key: "ArrowDown" });
    expect(activeOption()?.textContent).toContain("101 Jokes for Kids");
    expect(screen.getAllByRole("option", { selected: true })).toHaveLength(1);

    fireEvent.keyDown(input(), { key: "ArrowUp" });
    expect(activeOption()?.textContent).toContain("101 Jokes for Dads");
  });

  it("wraps around at either end of the list", async () => {
    render(<PredictiveSearch />);
    await search("jokes");

    fireEvent.keyDown(input(), { key: "ArrowUp" });
    expect(activeOption()?.textContent).toBe("Jokes for Kids");

    fireEvent.keyDown(input(), { key: "ArrowDown" });
    expect(activeOption()?.textContent).toContain("101 Jokes for Dads");
  });

  it("closes the dropdown on Escape and keeps the typed text", async () => {
    render(<PredictiveSearch />);
    await search("jokes");
    fireEvent.keyDown(input(), { key: "ArrowDown" });

    fireEvent.keyDown(input(), { key: "Escape" });

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input().getAttribute("aria-expanded")).toBe("false");
    expect(input().getAttribute("aria-activedescendant")).toBeNull();
    expect((input() as HTMLInputElement).value).toBe("jokes");
  });

  it("reopens the dropdown with the down arrow", async () => {
    render(<PredictiveSearch />);
    await search("jokes");
    fireEvent.keyDown(input(), { key: "Escape" });

    fireEvent.keyDown(input(), { key: "ArrowDown" });

    expect(screen.getByRole("listbox")).toBeDefined();
  });

  it("closes the dropdown when focus leaves the search", async () => {
    render(<PredictiveSearch />);
    await search("jokes");

    fireEvent.blur(input());

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("goes to the active suggestion on Enter", async () => {
    const onNavigate = vi.fn();
    render(<PredictiveSearch onNavigate={onNavigate} />);
    await search("jokes");
    fireEvent.keyDown(input(), { key: "ArrowDown" });

    fireEvent.keyDown(input(), { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/products/jokes-for-dads");
    expect(onNavigate).toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).toBeNull();
    expect((input() as HTMLInputElement).value).toBe("");
  });

  it("goes to the search results page on Enter when no suggestion is active", async () => {
    const onNavigate = vi.fn();
    render(<PredictiveSearch onNavigate={onNavigate} />);
    await search("  dad jokes & puns ");

    fireEvent.submit(screen.getByRole("search"));

    expect(mockPush).toHaveBeenCalledWith("/search?q=dad%20jokes%20%26%20puns");
    expect(onNavigate).toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("doesn't submit an empty search", () => {
    render(<PredictiveSearch />);

    type("   ");
    fireEvent.submit(screen.getByRole("search"));

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("clears the search when a suggestion is clicked", async () => {
    const onNavigate = vi.fn();
    render(<PredictiveSearch onNavigate={onNavigate} />);
    await search("jokes");

    fireEvent.click(screen.getByRole("option", { name: "Jokes for Kids" }));

    expect(onNavigate).toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).toBeNull();
    expect((input() as HTMLInputElement).value).toBe("");
  });

  it("shows an empty state when nothing matches", async () => {
    mockGetPredictiveSearch.mockResolvedValue({ products: [], collections: [] });
    render(<PredictiveSearch />);

    await search("zzzz");

    expect(screen.getByRole("status").textContent).toBe("No results for “zzzz”");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input().getAttribute("aria-expanded")).toBe("false");
  });

  it("announces how many suggestions there are", async () => {
    render(<PredictiveSearch />);

    await search("jokes");

    expect(screen.getByRole("status").textContent).toBe("3 suggestions available");
  });

  it("tells the shopper when suggestions can't be loaded", async () => {
    mockGetPredictiveSearch.mockRejectedValue(new Error("Storefront API error"));
    render(<PredictiveSearch />);

    await search("jokes");

    expect(screen.getByRole("status").textContent).toContain("Suggestions couldn't be loaded");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("clears the suggestions when the input is emptied", async () => {
    render(<PredictiveSearch />);
    await search("jokes");

    type("");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("ignores a response for a term that has since changed", async () => {
    let resolveFirst: (value: typeof results) => void = () => {};
    mockGetPredictiveSearch.mockReturnValueOnce(new Promise((resolve) => { resolveFirst = resolve; }));
    mockGetPredictiveSearch.mockResolvedValueOnce({ products: [], collections: [] });
    render(<PredictiveSearch />);

    await search("jokes");
    await search("zzzz");
    await act(async () => resolveFirst(results));

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("No results for “zzzz”");
  });
});
