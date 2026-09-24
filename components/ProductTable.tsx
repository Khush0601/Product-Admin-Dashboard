"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/lib/products";
import { getProductImage } from "@/lib/products";

export default function ProductTable({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-slate-400">
            <th className="px-3 py-3">Product</th>
            <th className="px-3 py-3">Category</th>
            <th className="px-3 py-3">Price</th>
            <th className="px-3 py-3">Rating</th>
            <th className="px-3 py-3">Stock</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-white/8 transition hover:bg-white/5"
            >
              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/10">
                    <Image
                      src={getProductImage(product) || "/favicon.ico"}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <Link
                    href={`/products/edit/${product.id}`}
                    className="max-w-[230px] font-semibold text-white hover:text-cyan-200"
                  >
                    {product.title}
                  </Link>
                </div>
              </td>
              <td className="px-3 py-4">
                <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-xs capitalize text-violet-100">
                  {product.category}
                </span>
              </td>
              <td className="px-3 py-4 font-semibold text-slate-200">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-3 py-4 text-slate-300">
                {product.rating ? `★ ${product.rating}` : "—"}
              </td>
              <td className="px-3 py-4">
                <StockBadge stock={product.stock} />
              </td>
              <td className="px-3 py-4">
                <div className="flex justify-end gap-2">
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
                    className="icon-button text-rose-200 hover:border-rose-300/30 hover:bg-rose-400/10 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 cursor-pointer" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  return (
    <span
      className={
        stock > 0
          ? "rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200"
          : "rounded-full border border-rose-300/20 bg-rose-400/10 px-2.5 py-1 text-xs font-semibold text-rose-200"
      }
    >
      {stock > 0 ? `${stock} in stock` : "Out of stock"}
    </span>
  );
}
