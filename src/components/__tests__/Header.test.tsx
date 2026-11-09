import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { getShop } from "@/lib/queries/shop";
import Header from "../Header";
import { makeShop } from "./_fixtures";

vi.mock("@/lib/queries/shop", () => ({
  getShop: vi.fn(),
}));

// The cart drawer needs the Shopify cart context, which isn't under test here.
vi.mock("@/components/CartDrawer", () => ({
  default: () => null,
}));

const mockGetShop = vi.mocked(getShop);

async function renderHeader() {
  render(await Header());
}

describe("Header", () => {
  afterEach(() => {
    cleanup();
    mockGetShop.mockReset();
  });

  it("shows the brand logo when one is set", async () => {
    mockGetShop.mockResolvedValue(makeShop());

    await renderHeader();

    const logo = screen.getByRole("img", { name: "Jokes 4 Folks logo" });
    expect(logo.getAttribute("src")).toContain("logo.png");
    expect(logo.closest("a")?.getAttribute("href")).toBe("/");
    expect(screen.queryByText("Cedar")).toBeNull();
  });

  it("uses the shop name as the logo's alt text when it has none", async () => {
    const shop = makeShop();
    shop.brand!.logo!.image!.altText = null;
    mockGetShop.mockResolvedValue(shop);

    await renderHeader();

    expect(screen.getByRole("img", { name: "Jokes 4 Folks" })).toBeDefined();
  });

  it("falls back to the text logo when no brand logo is set", async () => {
    mockGetShop.mockResolvedValue(makeShop({ brand: { ...makeShop().brand!, logo: null } }));

    await renderHeader();

    expect(screen.getByRole("link", { name: "Cedar" }).getAttribute("href")).toBe("/");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("falls back to the text logo when the shop has no brand", async () => {
    mockGetShop.mockResolvedValue(makeShop({ brand: null }));

    await renderHeader();

    expect(screen.getByRole("link", { name: "Cedar" })).toBeDefined();
  });

  it("falls back to the text logo when the shop can't be loaded", async () => {
    mockGetShop.mockRejectedValue(new Error("Storefront API error"));

    await renderHeader();

    expect(screen.getByRole("link", { name: "Cedar" })).toBeDefined();
  });

  it("renders the main navigation", async () => {
    mockGetShop.mockResolvedValue(makeShop());

    await renderHeader();

    expect(screen.getByRole("navigation", { name: "Main" })).toBeDefined();
  });
});
