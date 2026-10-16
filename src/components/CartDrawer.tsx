"use client";

import { useEffect, useId, useRef, useState } from "react";
import CartContents from "@/components/CartContents";
import { useCart } from "@shopify/hydrogen-react"

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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

    closeButtonRef.current?.focus();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [isOpen])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={totalQuantity > 0 ? `Cart, ${totalQuantity} ${itemLabel}` : "Cart"}
        onClick={() => setIsOpen(!isOpen)}
        className="relative -mr-2 p-2"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
        </svg>
        {totalQuantity > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          >
            {totalQuantity}
          </span>
        )}
      </button>
      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-0 z-50 transition-[visibility] duration-300 motion-reduce:transition-none ${isOpen ? "visible" : "invisible"}`}
      >
        <div
          aria-hidden="true"
          onClick={closeCart}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none dark:bg-black/60 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-4 shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none sm:p-6 dark:border-l ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 id={titleId} className="text-lg font-semibold">Your cart</h2>
            <button ref={closeButtonRef} type="button" aria-label="Close cart" onClick={closeCart} className="-mr-2 p-2">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 min-h-0 flex-1">
            <CartContents />
          </div>
        </div>
      </div>
    </>
  );
}
