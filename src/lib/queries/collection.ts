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

const COLLECTION_PRODUCT_FRAGMENT = `#graphql
  fragment CollectionProductFields on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
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
`

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
          ...CollectionProductFields
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
  ${COLLECTION_PRODUCT_FRAGMENT}
`

const COLLECTIONS_QUERY = `#graphql
  query CollectionsQuery($first: Int!, $productsFirst: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        products(first: $productsFirst) {
          nodes {
            ...CollectionProductFields
          }
        }
      }
    }
  }
  ${COLLECTION_PRODUCT_FRAGMENT}
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

// Shopify creates a "frontpage" collection by default; it isn't a real collection to shop.
const HIDDEN_COLLECTION_HANDLES = ["frontpage"];

export type CollectionSummary = Pick<Collection, "id" | "handle" | "title"> & {
  products: {
    nodes: CollectionProduct[];
  };
};

type CollectionsQuery = {
  collections: {
    nodes: CollectionSummary[];
  };
};

export async function getCollections(
  { productsPerCollection = 4 }: { productsPerCollection?: number } = {}
): Promise<CollectionSummary[]> {
  const data = await shopifyFetch<CollectionsQuery>(COLLECTIONS_QUERY, {
    first: 50,
    productsFirst: productsPerCollection,
  });

  return data.collections.nodes.filter(
    (collection) => !HIDDEN_COLLECTION_HANDLES.includes(collection.handle)
  );
}

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
