import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ProductGallery from "../ProductGallery";
import { makeProductDetail } from "./_fixtures";

describe("ProductGallery", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the first image by default", () => {
    render(<ProductGallery images={makeProductDetail().images.nodes} title="Product 1" />);

    expect(screen.getByRole("img", { name: "Front cover" })).toBeDefined();
  });

  it("swaps the main image when a thumbnail is clicked", () => {
    render(<ProductGallery images={makeProductDetail().images.nodes} title="Product 1" />);

    fireEvent.click(screen.getByRole("button", { name: "Show image 2 of 2" }));

    expect(screen.getByRole("img", { name: "Back cover" })).toBeDefined();
    expect(screen.queryByRole("img", { name: "Front cover" })).toBeNull();
  });

  it("hides the thumbnails when there is only one image", () => {
    const [firstImage] = makeProductDetail().images.nodes;

    render(<ProductGallery images={[firstImage]} title="Product 1" />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});