import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ShopifyProviders from "@/providers/ShopifyProviders";
import CartDrawer from "../CartDrawer";

function renderCartDrawer() {
  return render(<CartDrawer />, { wrapper: ShopifyProviders });
}

describe("CartDrawer", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STORE_DOMAIN", "test-store.myshopify.com");
    vi.stubEnv("NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN", "test-token");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it("is closed by default", () => {
    renderCartDrawer();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens when the Cart button is clicked", () => {
    renderCartDrawer();

    fireEvent.click(screen.getByRole("button", { name: "Cart" }));

    expect(screen.getByRole("dialog", { name: "Your cart" })).toBeDefined();
    expect(screen.getByText("Your cart is empty.")).toBeDefined();
  });

  it("closes when the close button is clicked", () => {
    renderCartDrawer();

    fireEvent.click(screen.getByRole("button", { name: "Cart" }));
    fireEvent.click(screen.getByRole("button", { name: "Close cart" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes when Escape is pressed", () => {
    renderCartDrawer();

    fireEvent.click(screen.getByRole("button", { name: "Cart" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});