"use client";

import { CartProvider, ShopifyProvider } from '@shopify/hydrogen-react';
import { STOREFRONT_API_VERSION } from "@/lib/constants";

export default function ShopifyProviders({ children }: { children: React.ReactNode }) {
  return (
    <ShopifyProvider
      storeDomain={process.env.NEXT_PUBLIC_STORE_DOMAIN!}
      storefrontToken={process.env.NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN!}
      storefrontApiVersion={STOREFRONT_API_VERSION}
      countryIsoCode='US'
      languageIsoCode='EN'
    >
      <CartProvider>
        {children}
      </CartProvider>
    </ShopifyProvider>
  );
}