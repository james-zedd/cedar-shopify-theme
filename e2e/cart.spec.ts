import { expect, test, type Page } from "@playwright/test";
import { findProductInStock, findProductWithVariants, type TestProductWithVariant } from "./store";

async function addToCart(page: Page) {
  await page.getByRole("button", { name: "Add to cart" }).click();
  // The header cart button's label carries the count; the visible badge is aria-hidden.
  await expect(page.getByRole("button", { name: "Cart, 1 item" })).toBeVisible();
}

async function selectVariant(page: Page, { option }: TestProductWithVariant) {
  const button = page
    .getByRole("group", { name: option.name })
    .getByRole("button", { name: option.value, exact: true });
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
}

async function openCart(page: Page) {
  await page.getByRole("button", { name: "Cart, 1 item" }).click();
  const cart = page.getByRole("dialog", { name: "Your cart" });
  await expect(cart).toBeVisible();
  return cart;
}

test("browse from the home page to the cart", async ({ page }) => {
  const product = await findProductWithVariants();
  await page.goto("/");

  await page
    .getByRole("link")
    .filter({ has: page.getByRole("heading", { name: product.title, exact: true }) })
    .first()
    .click();
  await expect(page).toHaveURL(product.path);
  await expect(page.getByRole("heading", { level: 1, name: product.title })).toBeVisible();

  await selectVariant(page, product);
  await addToCart(page);

  const cart = await openCart(page);
  const lines = cart.getByRole("listitem");
  await expect(lines).toHaveCount(1);
  await expect(lines.getByRole("heading", { name: product.title })).toBeVisible();
  await expect(lines.getByText(product.variantTitle, { exact: true })).toBeVisible();
});

test("go from the cart to Shopify checkout", async ({ page, baseURL }) => {
  const product = await findProductInStock();
  await page.goto(product.path);
  await addToCart(page);

  const cart = await openCart(page);
  await cart.getByRole("button", { name: "Checkout" }).click();

  // Hydrogen's checkout button sends the browser to the cart's Shopify-hosted
  // checkout URL. "commit" stops waiting once navigation starts, so the test
  // doesn't depend on how fast Shopify's checkout page loads.
  const siteHost = new URL(baseURL!).host;
  await page.waitForURL((url) => url.host !== siteHost, { waitUntil: "commit" });
  expect(page.url()).toMatch(/^https:\/\/[^/]+\/(cart\/c|checkouts)\//);
});
