"use client";

import { useEffect, useId, useRef, useState } from "react";
import CartContents from "@/components/CartContents";
import { useCart } from "@shopify/hydrogen-react"

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const { totalQuantity = 0 } = useCart();
  const itemLabel = totalQuantity === 1 ? "item" : "items";

  function closeCart() {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  })

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={totalQuantity > 0 ? `Cart, ${totalQuantity} ${itemLabel}` : "Cart"}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
        </svg>
        {totalQuantity > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white"
          >
            {totalQuantity}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div aria-hidden="true" onClick={closeCart} className="absolute inset-0 bg-black/40" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id={titleId} className="text-lg font-bold">Your cart</h2>
              <button type="button" aria-label="Close cart" autoFocus onClick={closeCart} className="text-2xl leading-none">
                x
              </button>
            </div>
            <div className="mt-6 min-h-0 flex-1">
              <CartContents />
            </div>
          </div>
        </div>
      )}
    </>
  );
}