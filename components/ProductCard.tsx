"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/lib/products";
import { getProductImage } from "@/lib/products";
import { StockBadge } from "@/components/ProductTable";

export default function ProductCard({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="grid gap-3 md:hidden">
      {products.map((product) => (
        <article
          key={product.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/10">
              <Image
                src={getProductImage(product) || "/favicon.ico"}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/edit/${product.id}`}
                className="font-semibold text-white hover:text-cyan-200"
              >
                {product.title}
              </Link>
              <p className="mt-1 text-xs capitalize text-violet-200">
                {product.category}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-200">
                ${product.price.toFixed(2)}{" "}
                <span className="ml-2 font-normal text-slate-400">
                  {product.rating ? `★ ${product.rating}` : ""}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <StockBadge stock={product.stock} />
            <div className="flex gap-2">
              <Link
                href={`/products/edit/${product.id}`}
                aria-label={`Edit ${product.title}`}
                className="icon-button"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => onDelete(product)}
                aria-label={`Delete ${product.title}`}
                className="icon-button text-rose-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
