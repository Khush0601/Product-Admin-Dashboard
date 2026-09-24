"use client";

import { Filter } from "lucide-react";

type Props = {
  categories: string[];
  category: string;
  sort: string;
  searchActive: boolean;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function FilterSort({
  categories,
  category,
  sort,
  searchActive,
  onCategoryChange,
  onSortChange,
}: Props) {
  return (
    <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Refine</span>
      </div>
      <select
        aria-label="Filter by category"
        value={category}
        disabled={searchActive}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="select cursor-pointer"
      >
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        aria-label="Sort products"
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
        className="select cursor-pointer"
      >
        <option value="">Latest</option>
        <option value="title-asc">Title A-Z</option>
        <option value="price-asc">Price low-high</option>
        <option value="price-desc">Price high-low</option>
        <option value="rating-desc">Top rated</option>
      </select>
    </div>
  );
}
