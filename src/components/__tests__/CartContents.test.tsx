import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react";
import { STOREFRONT_API_VERSION } from "@/lib/constants";
import CartContents from "../CartContents";
import { makeCart, type CartData } from "./_fixtures";

function renderCartContents(cart: CartData = makeCart()) {
  return render(
    <ShopifyProvider
      storeDomain="test-store.myshopify.com"
      storefrontToken="test-token"
      storefrontApiVersion={STOREFRONT_API_VERSION}
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      <CartProvider data={cart}>
        <CartContents />
      </CartProvider>
    </ShopifyProvider>,
  );
}

describe("CartContents", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders one list item per cart line", () => {
    renderCartContents();

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Product 1" })).toBeDefined();
    expect(screen.getByText("Paperback")).toBeDefined();
    expect(screen.queryByText("Default Title")).toBeNull();
  });

  it("renders the subtotal from the cart cost", () => {
    renderCartContents();

    expect(screen.getByRole("definition").textContent).toBe("$45.97");
  });

  it("removes a line when Remove is clicked", async () => {
    const cart = makeCart();
    const remainingCart = makeCart({
      totalQuantity: 1,
      lines: { nodes: [cart.lines!.nodes![1]] },
      cost: {
        subtotalAmount: { amount: "19.99", currencyCode: "USD" },
        totalAmount: { amount: "19.99", currencyCode: "USD" },
      },
    });
    const fetchMock = vi.fn(async () =>
      Response.json({ data: { cartLinesRemove: { cart: remainingCart } } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    renderCartContents(cart);
    fireEvent.click(screen.getByRole("button", { name: "Remove Product 1" }));

    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
    expect(screen.queryByRole("heading", { name: "Product 1" })).toBeNull();
    expect(screen.getByRole("definition").textContent).toBe("$19.99");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("renders the empty state when the cart has no lines", () => {
    renderCartContents(makeCart({ totalQuantity: 0, lines: { nodes: [] } }));

    expect(screen.getByText("Your cart is empty.")).toBeDefined();
    expect(screen.queryByRole("button", { name: "Checkout" })).toBeNull();
  });
});