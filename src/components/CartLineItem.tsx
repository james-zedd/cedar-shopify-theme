"use client";

import {
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  Image,
  Money,
  useCartLine,
} from "@shopify/hydrogen-react";

export default function CartLineItem() {
  const { merchandise, cost } = useCartLine();
  const productTitle = merchandise?.product?.title ?? "";
  const variantTitle = merchandise?.title;
  const showVariantTitle = variantTitle && variantTitle !== "Default Title";

  return (
    <div className="flex gap-4 py-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
        {merchandise?.image && (
          <Image
            data={merchandise.image}
            alt={merchandise.image.altText ?? productTitle}
            aspectRatio="1/1"
            sizes="80px"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium">{productTitle}</h3>
            {showVariantTitle && <p className="text-sm text-gray-500">{variantTitle}</p>}
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
            className="text-sm text-gray-500 underline disabled:opacity-50"
          >
            Remove
          </CartLineQuantityAdjustButton>
        </div>
      </div>
    </div>
  )
}