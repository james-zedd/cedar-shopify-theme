import { createStorefrontClient } from '@shopify/hydrogen-react';
import { STOREFRONT_API_VERSION } from "@/lib/constants";

const storeDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN!;
const publicStorefrontToken = process.env.NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN!;

const client = createStorefrontClient({
  storeDomain,
  publicStorefrontToken,
  storefrontApiVersion: STOREFRONT_API_VERSION,
});

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  { signal }: { signal?: AbortSignal } = {},
): Promise<T> {
  const res = await fetch(client.getStorefrontApiUrl(), {
    method: "POST",
    headers: client.getPublicTokenHeaders(),
    body: JSON.stringify({ query, variables }),
    signal,
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
};