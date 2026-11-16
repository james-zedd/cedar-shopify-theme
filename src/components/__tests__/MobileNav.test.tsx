import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SEARCH_DEBOUNCE_MS } from "../PredictiveSearch";
import MobileNav from "../MobileNav";
import { makeProduct } from "./_fixtures";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/queries/search", () => ({
  getPredictiveSearch: vi.fn(() => Promise.resolve({ products: [makeProduct()], collections: [] })),
}));

async function searchFor(value: string) {
  vi.useFakeTimers();
  fireEvent.change(screen.getByRole("combobox", { name: "Search" }), { target: { value } });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);
  });
  vi.useRealTimers();
}

describe("MobileNav", () => {
  afterEach(() => {
    cleanup();
  });

  it("is closed by default", () => {
    render(<MobileNav />);

    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("opens when the menu button is clicked", () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Shop" }).getAttribute("href")).toBe("/collections/jokes-for-kids");
  });

  it("closes when the menu button is clicked again", () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("closes when a link is clicked", () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("link", { name: "Shop" }));

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("closes when Escape is pressed", () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("has a search that is hidden until the menu is opened", () => {
    render(<MobileNav />);

    expect(screen.queryByRole("combobox", { name: "Search" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("combobox", { name: "Search" })).toBeDefined();
  });

  it("closes only the search suggestions on the first Escape", async () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await searchFor("jokes");

    fireEvent.keyDown(screen.getByRole("combobox", { name: "Search" }), { key: "Escape" });

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeDefined();

    fireEvent.keyDown(screen.getByRole("combobox", { name: "Search" }), { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("closes when a search suggestion is clicked", async () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await searchFor("jokes");

    fireEvent.click(screen.getByRole("option", { name: /Product 1/ }));

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });
});
