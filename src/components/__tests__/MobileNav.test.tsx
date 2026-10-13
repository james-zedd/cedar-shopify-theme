  import { afterEach, describe, expect, it } from "vitest";
  import { cleanup, fireEvent, render, screen } from "@testing-library/react";
  import MobileNav from "../MobileNav";

describe("MobileNav", () => {
  afterEach(() => {
    cleanup();
  });

  it("is closed by default", () => {
    render(<MobileNav />);

    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("opens when the menu button is clicked", () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Shop" }).getAttribute("href")).toBe("/collections/jokes-for-kids");
  });

  it("closes when the menu button is clicked again", () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("closes when a link is clicked", () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("link", { name: "Shop" }));

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("closes when Escape is pressed", () => {
    render(<MobileNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });
});