import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const sharedOpenGraph = {
  siteName: SITE_NAME,
  locale: "en_US",
  type: "website",
} satisfies OpenGraph;

type SeoImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function toOpenGraphImages(image: SeoImage | null | undefined, fallbackAlt: string) {
  if (!image) return undefined;

  return [
    {
      url: image.url,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
      alt: image.altText || fallbackAlt,
    },
  ];
}
