import { cache } from "react";
import { shopifyFetch } from "@/lib/shopify";
import type {
  Image,
  Metafield,
  MoneyV2,
  Product,
  ProductVariant,
  SelectedOption,
} from '@shopify/hydrogen-react/storefront-api-types';

const PRODUCT_QUERY = `#graphql
  query ProductQuery($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      availableForSale
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "author" }
        { namespace: "custom", key: "page_count" }
      ]) {
        key
        value
      }
    }
  }
`

export type ProductImage = Pick<Image, "id" | "url" | "altText" | "width" | "height">;

export type ProductDetailVariant = Pick<ProductVariant, "id" | "title" | "availableForSale"> & {
  selectedOptions: Pick<SelectedOption, "name" | "value">[];
  price: Pick<MoneyV2, "amount" | "currencyCode">;
};

export type ProductDetail = Pick<Product, "id" | "handle" | "title" | "descriptionHtml" | "availableForSale"> & {
  images: { nodes: ProductImage[] };
  variants: { nodes: ProductDetailVariant[] };
  metafields: (Pick<Metafield, "key" | "value"> | null)[];
};

type ProductQuery = {
  product: ProductDetail | null;
};

export const getProduct = cache(async (handle: string): Promise<ProductDetail | null> => {
  const data = await shopifyFetch<ProductQuery>(PRODUCT_QUERY, { handle });

  return data.product;
});