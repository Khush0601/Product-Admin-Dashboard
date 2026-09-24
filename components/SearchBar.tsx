"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  initialValue = "",
  onSearch,
  delay = 500,
}: {
  initialValue?: string;
  onSearch: (value: string) => void;
  delay?: number;
}) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    const timer = window.setTimeout(() => onSearch(value.trim()), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay, onSearch]);
  return (
    <div className="relative w-full">
      
      <input
        aria-label="Search products"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products..."
        className="input pl-11"
        id="search-input"
        name="product-search"
      />
      <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
