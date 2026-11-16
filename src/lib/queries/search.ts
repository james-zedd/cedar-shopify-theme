import { shopifyFetch } from "@/lib/shopify";
import {
  COLLECTION_PRODUCT_FRAGMENT,
  HIDDEN_COLLECTION_HANDLES,
  type CollectionProduct,
} from "@/lib/queries/collection";
import type { Collection } from "@shopify/hydrogen-react/storefront-api-types";

// `limitScope: EACH` applies the limit to products and collections separately,
// so a query that matches many products can't crowd the collections out.
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearchQuery($query: String!, $limit: Int!) {
    predictiveSearch(
      query: $query,
      limit: $limit,
      limitScope: EACH,
      types: [PRODUCT, COLLECTION]
    ) {
      products {
        ...CollectionProductFields
      }
      collections {
        id
        handle
        title
      }
    }
  }
  ${COLLECTION_PRODUCT_FRAGMENT}
`

export type PredictiveSearchCollection = Pick<Collection, "id" | "handle" | "title">;

export type PredictiveSearchResults = {
  products: CollectionProduct[];
  collections: PredictiveSearchCollection[];
};

type PredictiveSearchQuery = {
  predictiveSearch: PredictiveSearchResults | null;
};

type PredictiveSearchOptions = {
  limit?: number;
  signal?: AbortSignal;
};

// Runs in the browser as the shopper types, so it takes an abort signal to drop
// requests for a search term that has already been replaced.
export async function getPredictiveSearch(
  query: string,
  { limit = 4, signal }: PredictiveSearchOptions = {}
): Promise<PredictiveSearchResults> {
  const data = await shopifyFetch<PredictiveSearchQuery>(
    PREDICTIVE_SEARCH_QUERY,
    { query, limit },
    { signal },
  );

  return {
    products: data.predictiveSearch?.products ?? [],
    collections: (data.predictiveSearch?.collections ?? []).filter(
      (collection) => !HIDDEN_COLLECTION_HANDLES.includes(collection.handle)
    ),
  };
}
