"use client";

import { ShopifyProvider } from '@shopify/hydrogen-react';
import { storefrontApiVersion } from "@/lib/shopify";

export default function ShopifyProviders({ children }: { children: React.ReactNode }) {
  return (
    <ShopifyProvider
      storeDomain={process.env.NEXT_PUBLIC_STORE_DOMAIN!}
      storefrontToken={process.env.NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN!}
      storefrontApiVersion={storefrontApiVersion}
      countryIsoCode='US'
      languageIsoCode='EN'
    >
      {children}
    </ShopifyProvider>
  );
}