import { shopifyFetch } from "@/lib/shopify";
import { cache } from "react";
import type { Brand, Image, Shop } from "@shopify/hydrogen-react/storefront-api-types";

const SHOP_QUERY = `#graphql
  query ShopQuery {
    shop {
      name
      brand {
        logo {
          image {
            url
            altText
            width
            height
          }
        }
        slogan
        shortDescription
        coverImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`

export type ShopImage = Pick<Image, "url" | "altText" | "width" | "height">;

export type ShopBrand = Pick<Brand, "slogan" | "shortDescription"> & {
  logo: { image: ShopImage | null } | null;
  coverImage: { image: ShopImage | null } | null;
};

export type ShopInfo = Pick<Shop, "name"> & {
  brand: ShopBrand | null;
};

type ShopQuery = {
  shop: ShopInfo;
};

// Cached per request so the header and the home page hero share one fetch.
export const getShop = cache(async (): Promise<ShopInfo> => {
  const data = await shopifyFetch<ShopQuery>(SHOP_QUERY);

  return data.shop;
});
