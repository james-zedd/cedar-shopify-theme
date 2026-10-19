import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { getCollections } from "@/lib/queries/collection";
import Home from "../page";
import { makeCollectionSummary, makeProduct } from "@/components/__tests__/_fixtures";

vi.mock("@/lib/queries/collection", () => ({
  getCollections: vi.fn(),
}));

const mockGetCollections = vi.mocked(getCollections);

function makeProducts(collection: number, count: number) {
  return Array.from({ length: count }, (_, i) =>
    makeProduct({
      id: `gid://shopify/Product/${collection}-${i}`,
      handle: `product-${collection}-${i}`,
      title: `Product ${collection}-${i}`,
    }),
  );
}

const collections = [
  makeCollectionSummary({
    id: "gid://shopify/Collection/1",
    handle: "jokes-for-men-40",
    title: "Jokes for Men 40+",
    products: { nodes: makeProducts(1, 3) },
  }),
  makeCollectionSummary({
    id: "gid://shopify/Collection/2",
    handle: "jokes-for-kids",
    title: "Jokes for Kids",
    products: { nodes: makeProducts(2, 4) },
  }),
];

async function renderHome() {
  render(await Home());
}

describe("Home page", () => {
  afterEach(() => {
    cleanup();
    mockGetCollections.mockReset();
  });

  it("renders a section for each collection with its products", async () => {
    mockGetCollections.mockResolvedValue(collections);

    await renderHome();

    expect(screen.getByRole("heading", { level: 1, name: "Shop our collections" })).toBeDefined();

    const men = screen.getByRole("region", { name: "Jokes for Men 40+" });
    const kids = screen.getByRole("region", { name: "Jokes for Kids" });
    expect(within(men).getAllByRole("listitem")).toHaveLength(3);
    expect(within(kids).getAllByRole("listitem")).toHaveLength(4);
    expect(within(kids).getByRole("heading", { name: "Product 2-0" })).toBeDefined();
  });

  it("links each section to its collection page", async () => {
    mockGetCollections.mockResolvedValue(collections);

    await renderHome();

    expect(screen.getByRole("link", { name: "View all Jokes for Men 40+" }).getAttribute("href")).toBe(
      "/collections/jokes-for-men-40",
    );
    expect(screen.getByRole("link", { name: "View all Jokes for Kids" }).getAttribute("href")).toBe(
      "/collections/jokes-for-kids",
    );
  });

  it("loads images eagerly only in the first section", async () => {
    mockGetCollections.mockResolvedValue(collections);

    await renderHome();

    const firstImages = within(screen.getByRole("region", { name: "Jokes for Men 40+" })).getAllByRole("img");
    const secondImages = within(screen.getByRole("region", { name: "Jokes for Kids" })).getAllByRole("img");
    expect(firstImages.every((img) => img.getAttribute("loading") === "eager")).toBe(true);
    expect(secondImages.every((img) => img.getAttribute("loading") === "lazy")).toBe(true);
  });

  it("shows the empty state for a collection with no products", async () => {
    mockGetCollections.mockResolvedValue([
      makeCollectionSummary({ title: "Empty Collection", products: { nodes: [] } }),
    ]);

    await renderHome();

    const section = screen.getByRole("region", { name: "Empty Collection" });
    expect(within(section).getByText("No products in this collection yet.")).toBeDefined();
  });

  it("shows a message when there are no collections", async () => {
    mockGetCollections.mockResolvedValue([]);

    await renderHome();

    expect(screen.getByText("No collections found.")).toBeDefined();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });
});
