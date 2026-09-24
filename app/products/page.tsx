"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  PackagePlus,
  SearchCheck,
  ShoppingBag,
  UserRound,
  LogOut,
} from "lucide-react";
import { useSearchParams} from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import ProductCard from "@/components/ProductCard";
import ProductTable from "@/components/ProductTable";
import SearchBar from "@/components/SearchBar";
import FilterSort from "@/components/FilterSort";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import {
  applyOverrides,
  getCreatedProducts,
  recordDelete,
} from "@/lib/localProducts";
import type { Product } from "@/lib/products";

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseLimit(value: string | null) {
  return [10, 20, 50].includes(Number(value)) ? Number(value) : 10;
}

function normalizeCategories(items: unknown): string[] {
  if (!Array.isArray(items)) return [];

  return Array.from(
    new Set(
      items
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            const record = item as Record<string, unknown>;
            return typeof record.name === "string"
              ? record.name
              : typeof record.slug === "string"
                ? record.slug
                : "";
          }
          return "";
        })
        .filter((value): value is string => Boolean(value.trim())),
    ),
  );
}

export default function ProductsPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<Loader label="Loading catalog..." />}>
        <ProductsPageInner />
      </Suspense>
    </AuthGuard>
  );
}

function ProductsPageInner() {
  const searchParams = useSearchParams();
  const { logout, user } = useAuth();
  const [page, setPage] = useState(() => parsePage(searchParams.get("page")));
  const [limit, setLimit] = useState(() =>
    parseLimit(searchParams.get("limit")),
  );
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [category, setCategory] = useState(
    () => searchParams.get("category") || "",
  );
  const [sort, setSort] = useState(() => searchParams.get("sort") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const updateParams = useCallback(
    (next: Record<string, string | number>) => {
      const params = new URLSearchParams(window.location.search);
      params.delete("_rsc");

      let changed = false;

      Object.entries(next).forEach(([key, value]) => {
        const nextValue = value === "" ? null : String(value);
        const currentValue = params.get(key);

        if (nextValue === null) {
          if (currentValue !== null) {
            params.delete(key);
            changed = true;
          }
          return;
        }

        if (currentValue !== nextValue) {
          params.set(key, nextValue);
          changed = true;
        }
      });

      if (!changed) return;

      const nextUrl = `/products${params.toString() ? `?${params.toString()}` : ""}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      const normalizedCurrentUrl = currentUrl
        .replace(/[?&]_rsc=[^&]+/g, "")
        .replace(/[?&]+$/, "");
      const isPageOnlyUpdate = Object.keys(next).length === 1 && "page" in next;

      if (!isPageOnlyUpdate && normalizedCurrentUrl !== nextUrl) {
        window.history.pushState({}, "", nextUrl);
      }

      if ("page" in next) setPage(parsePage(String(next.page ?? page)));
      if ("limit" in next) setLimit(parseLimit(String(next.limit ?? limit)));
      if ("q" in next) setQuery(String(next.q ?? ""));
      if ("category" in next) setCategory(String(next.category ?? ""));
      if ("sort" in next) setSort(String(next.sort ?? ""));
    },
    [limit, page],
  );

  useEffect(() => {
    api
      .get("/products/categories")
      .then((response) => setCategories(normalizeCategories(response.data)))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      setErrorMessage("");

      const sortParts = sort ? sort.split("-") : [];
      const params = {
        limit,
        skip: (page - 1) * limit,
        sortBy: sortParts[0],
        order: sortParts[1],
        ...(query ? { q: query } : {}),
      };

      try {
        const endpoint = query
          ? "/products/search"
          : category
            ? `/products/category/${category}`
            : "/products";
        const response = await api.get(endpoint, {
          params,
          signal: controller.signal,
        });
        let list = applyOverrides(response.data.products || []) as Product[];
        let listTotal = response.data.total ?? list.length;

        if (page === 1 && !query && !category && !sort) {
          const created = getCreatedProducts();
          list = [...created, ...list].slice(0, limit);
          listTotal += created.length;
        }

        setProducts(list);
        setTotal(listTotal);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        const normalized = error as { message?: string; isCancelled?: boolean };
        if (normalized.isCancelled) return;
        setErrorMessage(normalized.message || "Failed to load products.");
        setStatus("error");
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [category, limit, page, query, sort]);

  const handleSearch = useCallback(
    (value: string) => updateParams({ q: value, category: "", page: 1 }),
    [updateParams],
  );
  const handleCategory = useCallback(
    (value: string) => updateParams({ category: value, q: "", page: 1 }),
    [updateParams],
  );
  const handleSort = useCallback(
    (value: string) => updateParams({ sort: value, page: 1 }),
    [updateParams],
  );

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      recordDelete(deleteTarget.id);
      setDeleteTarget(null);
      window.location.reload();
    } catch (error) {
      setErrorMessage(
        (error as { message?: string }).message || "Failed to delete product.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const stats = [
    { label: "Catalog total", value: total, tone: "blue" },
    {
      label: "Visible in stock",
      value: products.filter((product) => product.stock > 0).length,
      tone: "green",
    },
    {
      label: "Low stock",
      value: products.filter(
        (product) => product.stock > 0 && product.stock < 10,
      ).length,
      tone: "amber",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="overflow-hidden rounded-4xl border border-white/15 bg-white/6 shadow-[0_25px_80px_rgba(76,29,149,0.25)] backdrop-blur-2xl">
        <div className="flex flex-col gap-5 border-b border-white/10 bg-linear-to-r from-violet-500/15 via-white/5 to-blue-500/15 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
              Inventory workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Product catalog
            </h1>
            {user?.username ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                <UserRound className="h-4 w-4 text-violet-300" />
                Signed in as {user.username}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products/add"
              className="inline-flex items-center gap-2 rounded-2xl border border-violet-300/30 bg-linear-to-r from-violet-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(99,102,241,0.3)] hover:brightness-110"
            >
              <PackagePlus className="h-4 w-4" />
              Add product
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/7 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/12 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-7">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{stat.label}</span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${stat.tone === "blue" ? "bg-blue-300" : stat.tone === "green" ? "bg-emerald-300" : "bg-amber-300"}`}
                />
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </header>
      <section className="my-5 rounded-3xl border border-white/15 bg-white/6 p-4 shadow-[0_20px_60px_rgba(30,64,175,0.16)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-xl">
            <SearchBar
              key={query}
              initialValue={query}
              onSearch={handleSearch}
            />
          </div>
          <FilterSort
            categories={categories}
            category={category}
            sort={sort}
            searchActive={Boolean(query)}
            onCategoryChange={handleCategory}
            onSortChange={handleSort}
          />
        </div>
      </section>
      <section className="rounded-3xl border border-white/15 bg-white/6 p-4 shadow-[0_20px_60px_rgba(76,29,149,0.18)] backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <ShoppingBag className="h-4 w-4 text-cyan-200" />
            Active catalog
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
            <SearchCheck className="h-3.5 w-3.5" />
            {total} total items
          </span>
        </div>
        {status === "loading" ? (
          <Loader label="Loading products..." />
        ) : status === "error" ? (
          <ErrorState
            message={errorMessage}
            onRetry={() => window.location.reload()}
          />
        ) : products.length === 0 ? (
          <EmptyState message="No products match your search or filters." />
        ) : (
          <>
            <ProductTable products={products} onDelete={setDeleteTarget} />
            <ProductCard products={products} onDelete={setDeleteTarget} />
            <Pagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={(nextPage) => updateParams({ page: nextPage })}
              onLimitChange={(nextLimit) =>
                updateParams({ limit: nextLimit, page: 1 })
              }
            />
          </>
        )}
      </section>
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete product?"
        description={
          deleteTarget
            ? `This will remove "${deleteTarget.title}" from the visible catalog.`
            : ""
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}
