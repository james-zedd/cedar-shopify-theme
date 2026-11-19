import { expect, test } from "@playwright/test";
import { findProductInStock } from "./store";

test("search from the header and land on the results", async ({ page }) => {
  // Search for a real product's title, so the test doesn't depend on the catalogue's wording.
  const product = await findProductInStock();
  await page.goto("/");

  const search = page.getByRole("combobox", { name: "Search" });
  await search.fill(product.title);
  await search.press("Enter");

  await expect(page).toHaveURL(`/search?q=${encodeURIComponent(product.title)}`);
  await expect(
    page.getByRole("heading", { level: 1, name: `Search results for “${product.title}”` }),
  ).toBeVisible();
  await expect(page.getByText(/^\d+ results?$/)).toBeVisible();

  const results = page.getByRole("region", { name: "Search results" });
  await results
    .getByRole("link")
    .filter({ has: page.getByRole("heading", { name: product.title, exact: true }) })
    .first()
    .click();
  await expect(page).toHaveURL(product.path);
});

test("a search with no matches shows the no-results state", async ({ page }) => {
  // One made-up word: Shopify matches any word of a multi-word term, so a phrase like
  // "no-such-book" would still match products.
  await page.goto("/search?q=zzqxvjw");

  // Scoped to the region: while the page streams in, a hidden copy of the content can
  // sit outside it for a moment, and an unscoped text match would find both.
  const results = page.getByRole("region", { name: "Search results" });
  await expect(results.getByText("Check the spelling.")).toBeVisible();
  await expect(
    results.getByRole("navigation", { name: "Browse our collections" }).getByRole("link").first(),
  ).toBeVisible();
});
