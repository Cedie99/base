"use client";

import type { Category } from "@/types/listings";
import { PRODUCTS_BY_CATEGORY } from "@/types/listings";

export function ProductsEditor({
  category,
  selected,
  onChange,
}: {
  category: Exclude<Category, "person">;
  selected: string[];
  onChange: (products: string[]) => void;
}) {
  const products = PRODUCTS_BY_CATEGORY[category];

  function toggle(productName: string) {
    if (selected.includes(productName)) {
      onChange(selected.filter((p) => p !== productName));
    } else {
      onChange([...selected, productName]);
    }
  }

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h2 className="text-lg font-semibold">Products &amp; Services</h2>
      <p className="text-sm text-muted-foreground">
        Select the products and services offered.
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <label key={product} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(product)}
              onChange={() => toggle(product)}
              className="rounded border-input"
            />
            {product}
          </label>
        ))}
      </div>
    </div>
  );
}
