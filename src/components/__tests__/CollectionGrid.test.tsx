import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import CollectionGrid from "../CollectionGrid";
import { makeProduct } from "./fixtures";

describe("CollectionGrid", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders one card per product", () => {
    const products = [1, 2, 3].map((n) =>
      makeProduct({ id: `gid://shopify/Product/${n}`, title: `Product ${n}` }),
    );

    render(<CollectionGrid products={products} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("renders an empty state when there are no products", () => {
    render(<CollectionGrid products={[]} />);

    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("No products in this collection yet.")).toBeDefined();
  });
});