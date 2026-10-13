import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ShopifyProviders from "@/providers/ShopifyProviders";
import CartDrawer from "../CartDrawer";
import { STOREFRONT_API_VERSION } from "@/lib/constants";
import { makeCart, type CartData } from "./_fixtures";

function renderCartDrawer() {
  return render(<CartDrawer />, { wrapper: ShopifyProviders });
}

function renderCartDrawerWithCart(cart: CartData) {
  return render(
    <ShopifyProvider
      storeDomain="test-store.myshopify.com"
      storefrontToken="test-token"
      storefrontApiVersion={STOREFRONT_API_VERSION}
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      <CartProvider data={cart}>
        <CartDrawer />
      </CartProvider>
    </ShopifyProvider>,
  );
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

  it("shows the cart item count in the badge", () => {
    renderCartDrawerWithCart(makeCart());

    expect(screen.getByRole("button", { name: "Cart, 3 items" })).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
  });

  it("uses the singular label for one item", () => {
    renderCartDrawerWithCart(makeCart({ totalQuantity: 1 }));

    expect(screen.getByRole("button", { name: "Cart, 1 item" })).toBeDefined();
  });

  it("hides the badge when the cart is empty", () => {
    renderCartDrawerWithCart(makeCart({ totalQuantity: 0, lines: { nodes: [] } }));

    expect(screen.getByRole("button", { name: "Cart" }).textContent).toBe("");
  });
});