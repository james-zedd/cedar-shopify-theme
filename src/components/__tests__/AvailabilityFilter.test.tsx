import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import AvailabilityFilter from "../AvailabilityFilter";

describe("AvailabilityFilter", () => {
  afterEach(() => {
    cleanup();
  });

  it("links to the unfiltered and in-stock versions of the page", () => {
    render(<AvailabilityFilter basePath="/collections/kids" availableOnly={false} />);

    expect(screen.getByRole("link", { name: "All products" }).getAttribute("href"))
      .toBe("/collections/kids");
    expect(screen.getByRole("link", { name: "In stock" }).getAttribute("href"))
      .toBe("/collections/kids?available=true");
  });

  it("marks the active option with aria-current", () => {
    render(<AvailabilityFilter basePath="/collections/kids" availableOnly={true} />);

    expect(screen.getByRole("link", { name: "In stock" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "All products"
}).getAttribute("aria-current")).toBeNull();
  });
});