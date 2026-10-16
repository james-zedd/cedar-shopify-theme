"use client";

import { CartCheckoutButton, CartCost, CartLineProvider, useCart } from "@shopify/hydrogen-react";
import CartLineItem from "@/components/CartLineItem";

export default function CartContents() {
  const { lines } = useCart();
  const cartLines = lines?.filter((line) => line !== undefined) ?? [];

  if (cartLines.length === 0) {
    return <p className="text-muted-foreground">Your cart is empty.</p>;
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 divide-y overflow-y-auto">
        {cartLines.map((line) => (
          <li key={line.id}>
            <CartLineProvider line={line}>
              <CartLineItem />
            </CartLineProvider>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4">
        <dl className="flex justify-between font-medium">
          <dt>Subtotal</dt>
          <dd>
            <CartCost amountType="subtotal" />
          </dd>
        </dl>
        <p className="mt-1 text-sm text-muted-foreground">Taxes and shipping calculated at checkout.</p>
        <CartCheckoutButton className="mt-4 w-full rounded bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Checkout
        </CartCheckoutButton>
      </div>
    </div>
  )
}