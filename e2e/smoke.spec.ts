import { expect, test } from "@playwright/test";

test("home page shows collections and products from the store", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Shop our collections" })).toBeVisible();

  // The page is an async Server Component, so product cards only appear if the
  // Storefront API request succeeded at render time.
  const firstCollection = page.getByRole("region").first();
  await expect(firstCollection).toBeVisible();

  const firstProductTitle = firstCollection.getByRole("heading", { level: 3 }).first();
  await expect(firstProductTitle).toBeVisible();
  await expect(firstProductTitle).not.toBeEmpty();
});
