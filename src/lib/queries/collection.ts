import { shopifyFetch } from "@/lib/shopify";
import type {
  Collection,
  Image,
  MoneyV2,
  Product,
} from "@shopify/hydrogen-react/storefront-api-types";

const COLLECTION_QUERY = `#graphql
  query CollectionQuery($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      products(first: $first) {
        nodes {
          id
          handle
          title
          featuredImage{
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

export type CollectionProduct = Pick<Product, "id" | "handle" | "title"> & {
  featuredImage: Pick<Image, "url" | "altText" | "width" | "height"> | null;
  priceRange: {
    minVariantPrice: Pick<MoneyV2, "amount" | "currencyCode">;
    maxVariantPrice: Pick<MoneyV2, "amount" | "currencyCode">;
  };
};

export type CollectionWithProducts = Pick<Collection, "id" | "title"> & {
  products: { nodes: CollectionProduct[] };
};

type CollectionQuery = {
  collection: CollectionWithProducts | null;
};

export async function getCollection(handle: string, first: number = 12): Promise<CollectionWithProducts | null> {
  const data = await shopifyFetch<CollectionQuery>(COLLECTION_QUERY, { handle, first });
  return data.collection;
};