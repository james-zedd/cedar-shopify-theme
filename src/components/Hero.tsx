import Image from "next/image";
import Link from "next/link";
import { FEATURED_COLLECTION_HANDLE } from "@/lib/constants";
import type { ShopBrand } from "@/lib/queries/shop";

// Filler content shown until the slogan, short description and cover image
// are set under Settings > Brand in the Shopify admin.
export const HERO_FILLER = {
  slogan: "Seriously good jokes.",
  description: "Joke books for kids, grown-ups and everyone who should know better.",
  image: {
    url: "/hero-placeholder.svg",
    altText: "Illustrated Christmas tree on snowy hills at night",
  },
};

type HeroProps = {
  brand: ShopBrand | null;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function Hero({
  brand,
  ctaHref = `/collections/${FEATURED_COLLECTION_HANDLE}`,
  ctaLabel = "Shop now",
}: HeroProps) {
  const slogan = brand?.slogan || HERO_FILLER.slogan;
  // Only pair the filler description with the filler slogan.
  const description = brand?.shortDescription || (brand?.slogan ? null : HERO_FILLER.description);
  const coverImage = brand?.coverImage?.image;

  return (
    <div className="relative isolate flex min-h-[26rem] items-end overflow-hidden bg-muted sm:min-h-[32rem]">
      <Image
        src={coverImage?.url ?? HERO_FILLER.image.url}
        alt={coverImage ? (coverImage.altText ?? "") : HERO_FILLER.image.altText}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        // The local placeholder can't go through the Shopify CDN loader.
        unoptimized={!coverImage}
        className="-z-20 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/35 to-transparent" />
      <div className="page-container py-10 text-white sm:py-14">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{slogan}</h1>
        {description && <p className="mt-4 max-w-xl text-base text-white/90 sm:text-lg">{description}</p>}
        <Link
          href={ctaHref}
          className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/85"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
