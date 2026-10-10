"use client";

import { useProduct } from "@shopify/hydrogen-react";

export default function VariantSelector() {
  const { options, selectedOptions, setSelectedOption, isOptionInStock } = useProduct();

  return (
    <div className="space-y-4">
      {options?.map((option) => {
        if (!option?.name || !option.values || option.values.length < 2) {
          return null;
        }

        const name = option.name;

        return (
          <fieldset key={name}>
            <legend className="text-sm font-medium">{name}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {option.values.map((value) => {
                if (!value) {
                  return null;
                }

                const isSelected = selectedOptions?.[name] === value;
                const inStock = isOptionInStock(name, value);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedOption(name, value)}
                    aria-pressed={isSelected}
                    className={`
                      rounded border px-4 py-2 text-sm
                      ${isSelected ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300"}
                      ${inStock ? "" : "text-gray-400 line-through"}
                    `}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}