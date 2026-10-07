import { shopifyFetch } from "@/lib/shopify";
import type {
  Collection,
  Image,
  MoneyV2,
  PageInfo,
  Product,
} from "@shopify/hydrogen-react/storefront-api-types";

const COLLECTION_QUERY = `#graphql
  query CollectionQuery(
    $handle: String!,
    $first: Int,
    $after: String,
    $before: String,
    $last: Int
  ) {
    collection(handle: $handle) {
      id
      title
      products(first: $first, after: $after, before: $before, last: $last) {
        nodes {
          id
          handle
          title
          availableForSale
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
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`

export type CollectionProduct = Pick<Product, "id" | "handle" | "title" | "availableForSale"> & {
  featuredImage: Pick<Image, "url" | "altText" | "width" | "height"> | null;
  priceRange: {
    minVariantPrice: Pick<MoneyV2, "amount" | "currencyCode">;
    maxVariantPrice: Pick<MoneyV2, "amount" | "currencyCode">;
  };
};

export type CollectionWithProducts = Pick<Collection, "id" | "title"> & {
  products: {
    nodes: CollectionProduct[];
    pageInfo: Pick<PageInfo, "hasNextPage" | "hasPreviousPage" | "startCursor" | "endCursor">;
  };
};

type CollectionQuery = {
  collection: CollectionWithProducts | null;
};

type CollectionPageOptions = {
  pageSize?: number;
  after?: string;
  before?: string;
}

export async function getCollection(
  handle: string,
  { pageSize = 12, after, before }: CollectionPageOptions = {}
): Promise<CollectionWithProducts | null> {
  const pagination = before
    ? { last: pageSize, before }
    : { first: pageSize, after };
  const data = await shopifyFetch<CollectionQuery>(COLLECTION_QUERY, { handle, ...pagination });
  return data.collection;
};