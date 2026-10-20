import { getCollections } from "@/lib/queries/collection";
import { getProduct, type ProductDetailVariant } from "@/lib/queries/product";

// Picks products for the E2E flows from the live store when the tests run, so
// renaming a product or selling out a variant doesn't break the suite.

export type TestProduct = {
  title: string;
  path: string;
};

export type TestProductWithVariant = TestProduct & {
  // The option button to click and the variant title the cart line should show.
  option: { name: string; value: string };
  variantTitle: string;
};

// Products in the order the home page shows them, so Flow 1 can click a card that's there.
async function homePageProducts() {
  const collections = await getCollections();
  const products = collections.flatMap((collection) => collection.products.nodes);
  return [...new Map(products.map((product) => [product.handle, product])).values()];
}

// The product page starts on the first in-stock variant. Find another in-stock
// variant one option click away from it, so selecting a variant changes what's added.
function findVariantSwitch(variants: ProductDetailVariant[]) {
  const inStock = variants.filter((variant) => variant.availableForSale);
  const [initial, ...others] = inStock;
  if (!initial) return null;

  for (const variant of others) {
    const changed = variant.selectedOptions.filter(
      (option) => !initial.selectedOptions.some((o) => o.name === option.name && o.value === option.value),
    );
    if (changed.length === 1) {
      return { option: changed[0], variantTitle: variant.title };
    }
  }
  return null;
}

export async function findProductWithVariants(): Promise<TestProductWithVariant> {
  for (const { handle, availableForSale } of await homePageProducts()) {
    if (!availableForSale) continue;

    const product = await getProduct(handle);
    const variantSwitch = product && findVariantSwitch(product.variants.nodes);
    if (variantSwitch) {
      return { title: product.title, path: `/products/${handle}`, ...variantSwitch };
    }
  }
  throw new Error(
    "No product on the home page has two in-stock variants, so the variant selection flow can't run. " +
      "Restock a variant or add a product with options (e.g. Paperback/Hardcover) to a collection.",
  );
}

export async function findProductInStock(): Promise<TestProduct> {
  const product = (await homePageProducts()).find((p) => p.availableForSale);
  if (!product) {
    throw new Error("No product on the home page is in stock, so nothing can be added to the cart.");
  }
  return { title: product.title, path: `/products/${product.handle}` };
}
