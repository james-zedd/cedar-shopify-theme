"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Money } from "@shopify/hydrogen-react";
import { getPredictiveSearch, type PredictiveSearchResults } from "@/lib/queries/search";

export const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

type Suggestions = PredictiveSearchResults & {
  // The search term these suggestions are for, which can lag behind the input while typing.
  term: string;
  failed: boolean;
};

type PredictiveSearchProps = {
  // Called when the shopper leaves for a suggestion or the results page, e.g. to close the mobile menu.
  onNavigate?: () => void;
};

export default function PredictiveSearch({ onNavigate }: PredictiveSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const productsHeadingId = `${baseId}-products`;
  const collectionsHeadingId = `${baseId}-collections`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const products = suggestions?.products ?? [];
  const collections = suggestions?.collections ?? [];
  // Every option in the order it is shown, so the arrow keys can step through both groups.
  const optionHrefs = [
    ...products.map((product) => `/products/${product.handle}`),
    ...collections.map((collection) => `/collections/${collection.handle}`),
  ];
  const hasOptions = optionHrefs.length > 0;
  const showPopup = isOpen && suggestions !== null;
  const isExpanded = showPopup && hasOptions;

  let statusMessage = "";
  if (showPopup && suggestions.failed) {
    statusMessage = "Suggestions couldn't be loaded. Press Enter to search.";
  } else if (showPopup && !hasOptions) {
    statusMessage = `No results for “${suggestions.term}”`;
  } else if (showPopup) {
    statusMessage = `${optionHrefs.length} ${optionHrefs.length === 1 ? "suggestion" : "suggestions"} available`;
  }

  useEffect(() => {
    const term = query.trim();
    if (term.length < MIN_QUERY_LENGTH) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const results = await getPredictiveSearch(term, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setSuggestions({ ...results, term, failed: false });
          setActiveIndex(-1);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions({ products: [], collections: [], term, failed: true });
          setActiveIndex(-1);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (activeIndex >= 0) {
      // Optional call: jsdom doesn't implement scrollIntoView.
      document.getElementById(`${baseId}-option-${activeIndex}`)?.scrollIntoView?.({ block: "nearest" });
    }
  }, [activeIndex, baseId]);

  // The header stays mounted between pages, so the search has to be cleared by hand on the way out.
  function reset() {
    setQuery("");
    setSuggestions(null);
    setActiveIndex(-1);
    setIsOpen(false);
    onNavigate?.();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuery(value);
    setIsOpen(true);
    setActiveIndex(-1);
    if (value.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions(null);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        if (!hasOptions) {
          return;
        }
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        const step = event.key === "ArrowDown" ? 1 : -1;
        const start = activeIndex < 0 && step < 0 ? 0 : activeIndex;
        setActiveIndex((start + step + optionHrefs.length) % optionHrefs.length);
        return;
      }
      case "Enter": {
        // With no active option, Enter falls through to the form and opens the results page.
        if (isExpanded && activeIndex >= 0) {
          event.preventDefault();
          router.push(optionHrefs[activeIndex]);
          reset();
        }
        return;
      }
      case "Escape": {
        if (showPopup) {
          // Marks the key press as handled, so the mobile menu the search sits in stays open.
          event.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
        }
        return;
      }
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (!term) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(term)}`);
    reset();
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const optionClassName =
    "flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted aria-selected:bg-muted";

  return (
    <div className="relative" onBlur={handleBlur}>
      <form role="search" onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          role="combobox"
          aria-label="Search"
          aria-expanded={isExpanded}
          aria-controls={isExpanded ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={isExpanded && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          placeholder="Search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-md border bg-background py-2 pl-3 pr-10 text-base placeholder:text-muted-foreground md:text-sm"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>
      <p role="status" className="sr-only">{statusMessage}</p>
      {showPopup && (
        <div
          // Keeps focus in the input when a suggestion is pressed, so the blur doesn't close the list before the click lands.
          onMouseDown={(event) => event.preventDefault()}
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-md border bg-background shadow-lg"
        >
          {hasOptions ? (
            <div id={listboxId} role="listbox" aria-label="Search suggestions" className="py-2">
              {products.length > 0 && (
                <div role="group" aria-labelledby={productsHeadingId}>
                  <p id={productsHeadingId} className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Products
                  </p>
                  {products.map((product, index) => (
                    <Link
                      key={product.id}
                      id={optionId(index)}
                      role="option"
                      aria-selected={index === activeIndex}
                      tabIndex={-1}
                      href={`/products/${product.handle}`}
                      onClick={reset}
                      className={optionClassName}
                    >
                      <span className="relative size-12 shrink-0 overflow-hidden rounded bg-muted">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{product.title}</span>
                        <Money as="span" data={product.priceRange.minVariantPrice} className="text-muted-foreground" />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              {collections.length > 0 && (
                <div role="group" aria-labelledby={collectionsHeadingId}>
                  <p id={collectionsHeadingId} className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Collections
                  </p>
                  {collections.map((collection, index) => (
                    <Link
                      key={collection.id}
                      id={optionId(products.length + index)}
                      role="option"
                      aria-selected={products.length + index === activeIndex}
                      tabIndex={-1}
                      href={`/collections/${collection.handle}`}
                      onClick={reset}
                      className={optionClassName}
                    >
                      {collection.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="px-3 py-4 text-sm text-muted-foreground">{statusMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
