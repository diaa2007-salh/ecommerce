// src/components/store/ProductFilters.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

export default function ProductFilters({ categories, currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => { if (v && k !== key) params.set(k, v); });
    if (value) params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const sortOptions = [
    { value: "", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
  ];

  return (
    <div className="space-y-6 sticky top-24">
      {/* Sort */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-ash mb-3">Sort</h3>
        <div className="space-y-1">
          {sortOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateParam("sort", value || null)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                (currentParams.sort ?? "") === value
                  ? "bg-brand-100 text-brand-700 font-medium"
                  : "text-ash hover:text-obsidian hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-ash mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam("category", null)}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !currentParams.category
                ? "bg-brand-100 text-brand-700 font-medium"
                : "text-ash hover:text-obsidian hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.slug)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                currentParams.category === cat.slug
                  ? "bg-brand-100 text-brand-700 font-medium"
                  : "text-ash hover:text-obsidian hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-ash mb-3">Price</h3>
        <div className="space-y-2">
          {[
            { label: "Under $100", min: null, max: "100" },
            { label: "$100 – $200", min: "100", max: "200" },
            { label: "Over $200", min: "200", max: null },
          ].map(({ label, min, max }) => (
            <button
              key={label}
              onClick={() => {
                const params = new URLSearchParams();
                if (currentParams.category) params.set("category", currentParams.category);
                if (min) params.set("minPrice", min);
                if (max) params.set("maxPrice", max);
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="w-full text-left text-sm px-3 py-2 rounded-lg text-ash hover:text-obsidian hover:bg-gray-100 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {Object.values(currentParams).some(Boolean) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs text-red-500 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
