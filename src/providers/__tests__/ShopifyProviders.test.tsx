import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { useShop } from "@shopify/hydrogen-react";
import ShopifyProviders from "../ShopifyProviders";

function ShopDomain() {
  const { storeDomain } = useShop();
  return <p>{storeDomain}</p>;
}

describe("ShopifyProviders", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STORE_DOMAIN", "test-store.myshopify.com");
    vi.stubEnv("NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN", "test-token");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it("renders its children", () => {
    render(
      <ShopifyProviders>
        <h1>Cedar</h1>
      </ShopifyProviders>,
    );
    expect(screen.getByRole("heading", { name: "Cedar" })).toBeDefined();
  });

  it("passes the store config to hydrogen-react", () => {
    render(
      <ShopifyProviders>
        <ShopDomain />
      </ShopifyProviders>,
    );
    expect(screen.getByText("test-store.myshopify.com")).toBeDefined();
  });
});