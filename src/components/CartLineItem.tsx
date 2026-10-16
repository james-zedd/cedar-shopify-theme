"use client";

import {
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  Money,
  useCartLine,
} from "@shopify/hydrogen-react";
import Image from "next/image";

export default function CartLineItem() {
  const { merchandise, cost } = useCartLine();
  const productTitle = merchandise?.product?.title ?? "";
  const variantTitle = merchandise?.title;
  const showVariantTitle = variantTitle && variantTitle !== "Default Title";

  return (
    <div className="flex gap-4 py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-muted">
        {merchandise?.image?.url && (
          <Image
            src={merchandise.image.url}
            alt={merchandise.image.altText ?? productTitle}
            fill
            sizes="80px"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium">{productTitle}</h3>
            {showVariantTitle && <p className="text-sm text-muted-foreground">{variantTitle}</p>}
          </div>
          {cost?.totalAmount && <Money data={cost.totalAmount} className="text-sm" />}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded border">
            <CartLineQuantityAdjustButton
              adjust="decrease"
              aria-label={`Decrease quantity of ${productTitle}`}
              className="px-3 py-1 disabled:opacity-50"
            >
              -
            </CartLineQuantityAdjustButton>
            <CartLineQuantity className="min-w-8 text-center text-sm" />
            <CartLineQuantityAdjustButton
              adjust="increase"
              aria-label={`Increase quantity of ${productTitle}`}
              className="px-3 py-1 disabled:opacity-50"
            >
              +
            </CartLineQuantityAdjustButton>
          </div>
          <CartLineQuantityAdjustButton
            adjust="remove"
            aria-label={`Remove ${productTitle}`}
            className="text-sm text-muted-foreground underline hover:text-foreground disabled:opacity-50"
          >
            Remove
          </CartLineQuantityAdjustButton>
        </div>
      </div>
    </div>
  )
}