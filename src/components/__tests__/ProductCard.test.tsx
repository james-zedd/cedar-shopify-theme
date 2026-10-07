import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { makeProduct } from './_fixtures';

describe('ProductCard', () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the title and formatted price", () => {
    render(<ProductCard product={makeProduct()} />);

    expect(screen.getByRole("heading", { name: "Product 1" })).toBeDefined();
    expect(screen.getByText("$10.00")).toBeDefined();
  });

  it("renders the image with its alt text from Shopify", () => {
    render(<ProductCard product={makeProduct()} />);

    expect(screen.getByRole("img", { name: "Product 1 Image" })).toBeDefined();
  });

  it("falls back to the product title when the image has no alt text", () => {
    const product = makeProduct();
    product.featuredImage = { ...product.featuredImage!, altText: null };

    render(<ProductCard product={product} />);

    expect(screen.getByRole("img", { name: "Product 1" })).toBeDefined();
  });

  it("renders no image when the product has none", () => {
    render(<ProductCard product={makeProduct({ featuredImage: null })} />);

    expect(screen.queryByRole("img")).toBeNull();
  });

  it("shows a sold out badge when the product is unavailable", () => {
    render(<ProductCard product={makeProduct({ availableForSale: false })} />);

    expect(screen.getByText("Sold out")).toBeDefined();
  });

  it("shows no sold out badge when the product is available", () => {
    render(<ProductCard product={makeProduct()} />);

    expect(screen.queryByText("Sold out")).toBeNull();
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={makeProduct()} />);

    expect(screen.getByRole("link").getAttribute("href")).toBe("/products/product-1");
  });
});