"use client";

import type { ImageLoaderProps } from "next/image";

export default function shopifyImageLoader({ src, width }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}
