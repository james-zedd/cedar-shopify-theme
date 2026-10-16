import { shopifyFetch } from "@/lib/shopify";
import { cache } from "react";
import type {
  Collection,
  Image,
  Seo,
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
    $last: Int,
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      products(
        first: $first,
        after: $after,
        before: $before,
        last: $last,
        filters: $filters
      ) {
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

const COLLECTION_SEO_QUERY = `#graphql
  query CollectionSeoQuery($handle: String!) {
    collection(handle: $handle) {
      handle
      title
      description(truncateAt: 160)
      seo {
        title
        description
      }
      image {
        url
        altText
        width
        height
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
  availableOnly?: boolean;
}

export async function getCollection(
  handle: string,
  { pageSize = 12, after, before, availableOnly = false }: CollectionPageOptions = {}
): Promise<CollectionWithProducts | null> {
  const pagination = before
    ? { last: pageSize, before }
    : { first: pageSize, after };

  const filters = availableOnly ? [{ available: true }] : undefined;
  
  const data = await shopifyFetch<CollectionQuery>(COLLECTION_QUERY, { handle, ...pagination, filters });
  
  return data.collection;
};

export type CollectionSeo = Pick<Collection, "handle" | "title" | "description"> & {
  seo: Pick<Seo, "title" | "description">;
  image: Pick<Image, "url" | "altText" | "width" | "height"> | null;
};

type CollectionSeoQuery = {
  collection: CollectionSeo | null;
};

export const getCollectionSeo = cache(async (handle: string): Promise<CollectionSeo | null> => {
  const data = await shopifyFetch<CollectionSeoQuery>(COLLECTION_SEO_QUERY, { handle });

  return data.collection;
});
