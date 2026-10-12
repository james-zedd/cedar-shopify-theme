"use client";

import { useEffect, useId, useRef, useState } from "react";
import CartContents from "@/components/CartContents";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

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
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium"
      >
        Cart
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