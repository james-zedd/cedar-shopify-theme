import { describe, expect, it } from "vitest";
import { sanitizeProductHtml } from "../sanitize";

describe("sanitizeProductHtml", () => {
  it("keeps safe formatting tags", () => {
    expect(sanitizeProductHtml("<p>Hi <strong>there</strong></p>")).toBe("<p>Hi <strong>there</strong></p>");
  });

  it("strips script tags and event handler attributes", () => {
    const html = '<p onclick="steal()">Hi</p><script>alert(1)</script><img src="x" onerror="alert(1)">';

    expect(sanitizeProductHtml(html)).toBe("<p>Hi</p>");
  });

  it("removes javascript: links and hardens external links", () => {
    const html = '<a href="javascript:alert(1)">bad</a><a href="https://example.com" target="_blank">ok</a>';

    expect(sanitizeProductHtml(html)).toBe(
      '<a rel="noopener noreferrer">bad</a><a href="https://example.com" target="_blank" rel="noopener noreferrer">ok</a>',
    );
  });

  it("removes mailto links", () => {
    expect(sanitizeProductHtml('<a href="mailto:me@example.com">email</a>')).toBe(
      '<a rel="noopener noreferrer">email</a>',
    );
  });

  it("keeps emojis and emoticons", () => {
    expect(sanitizeProductHtml("<p>Dad jokes 😂 ¯\\_(ツ)_/¯</p>")).toBe("<p>Dad jokes 😂 ¯\\_(ツ)_/¯</p>");
  });
});