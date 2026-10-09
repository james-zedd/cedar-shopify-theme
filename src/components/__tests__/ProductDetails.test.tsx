import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import ProductDetails from "../ProductDetails";
import { makeProductDetail } from "./_fixtures";

describe("ProductDetails", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the product title and the selected variant's price", () => {
    render(<ProductDetails product={makeProductDetail()} />);

    expect(screen.getByRole("heading", { name: "Product 1" })).toBeDefined();
    expect(screen.getByText("$12.99")).toBeDefined();
  });
});