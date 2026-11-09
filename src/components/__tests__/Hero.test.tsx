import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Hero, { HERO_FILLER } from "../Hero";
import { makeShop } from "./_fixtures";

describe("Hero", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the slogan, description and cover image from shop data", () => {
    render(<Hero brand={makeShop().brand} />);

    expect(screen.getByRole("heading", { level: 1, name: "Books that make you groan" })).toBeDefined();
    expect(screen.getByText("Joke books for the whole family.")).toBeDefined();

    const image = screen.getByRole("img", { name: "A stack of joke books" });
    expect(image.getAttribute("src")).toContain("cover.png");
  });

  it("links the call to action to the featured collection", () => {
    render(<Hero brand={makeShop().brand} />);

    expect(screen.getByRole("link", { name: "Shop now" }).getAttribute("href")).toBe("/collections/jokes-for-kids");
  });

  it("accepts a custom call to action", () => {
    render(<Hero brand={makeShop().brand} ctaHref="/collections/sale" ctaLabel="Shop the sale" />);

    expect(screen.getByRole("link", { name: "Shop the sale" }).getAttribute("href")).toBe("/collections/sale");
  });

  it("loads the image eagerly with high priority for LCP", () => {
    render(<Hero brand={makeShop().brand} />);

    const image = screen.getByRole("img", { name: "A stack of joke books" });
    expect(image.getAttribute("loading")).toBe("eager");
    expect(image.getAttribute("fetchpriority")).toBe("high");
  });

  it("falls back to filler content when no brand is set", () => {
    render(<Hero brand={null} />);

    expect(screen.getByRole("heading", { level: 1, name: HERO_FILLER.slogan })).toBeDefined();
    expect(screen.getByText(HERO_FILLER.description)).toBeDefined();
    expect(screen.getByRole("img", { name: HERO_FILLER.image.altText }).getAttribute("src")).toBe(
      HERO_FILLER.image.url,
    );
    expect(screen.getByRole("link", { name: "Shop now" })).toBeDefined();
  });

  it("falls back to filler content when the brand fields are empty", () => {
    render(<Hero brand={{ logo: null, slogan: null, shortDescription: null, coverImage: null }} />);

    expect(screen.getByRole("heading", { level: 1, name: HERO_FILLER.slogan })).toBeDefined();
    expect(screen.getByRole("img", { name: HERO_FILLER.image.altText })).toBeDefined();
  });

  it("does not pair the filler description with a real slogan", () => {
    const brand = { ...makeShop().brand!, shortDescription: null };

    render(<Hero brand={brand} />);

    expect(screen.getByRole("heading", { level: 1, name: "Books that make you groan" })).toBeDefined();
    expect(screen.queryByText(HERO_FILLER.description)).toBeNull();
  });
});
