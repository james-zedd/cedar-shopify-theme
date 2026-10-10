import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ShopifyProviders from "@/providers/ShopifyProviders";
import ProductDetails from "../ProductDetails";
import { makeProductDetail } from "./_fixtures";
import type { ProductDetail } from "@/lib/queries/product";

function renderProductDetails(product: ProductDetail = makeProductDetail()) {
  return render(<ProductDetails product={product} />, { wrapper: ShopifyProviders });
}

describe("ProductDetails", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STORE_DOMAIN", "test-store.myshopify.com");
    vi.stubEnv("NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN", "test-token");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it("renders the product title and the selected variant's price", () => {
    renderProductDetails();

    expect(screen.getByRole("heading", { name: "Product 1" })).toBeDefined();
    expect(screen.getByText("$12.99")).toBeDefined();
  });

  it("updates the selected variant when an option is clicked", () => {
    renderProductDetails();

    const hardcover = screen.getByRole("button", { name: "Hardcover" });
    fireEvent.click(hardcover);

    expect(hardcover.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Paperback" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText("$19.99")).toBeDefined();
  });

  it("enables Add to cart when the selected variant is available", () => {
    renderProductDetails();

    const button = screen.getByRole("button", { name: "Add to cart" }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it("disables Add to cart when the selected variant is unavailable", () => {
    renderProductDetails();

    fireEvent.click(screen.getByRole("button", { name: "Hardcover" }));

    const button = screen.getByRole("button", { name: "Sold out" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("hides the option picker when an option has only one value", () => {
    const product = makeProductDetail();
    product.variants = { nodes: [product.variants.nodes[0]] };

    renderProductDetails(product);

    expect(screen.queryByRole("button", { name: "Paperback" })).toBeNull();
  });
});