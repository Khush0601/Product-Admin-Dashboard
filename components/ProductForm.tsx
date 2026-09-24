"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Save } from "lucide-react";
import type { ProductInput } from "@/lib/products";

type Props = {
  initialValues?: Partial<ProductInput>;
  onSubmit: (values: ProductInput) => void;
  submitting: boolean;
  submitLabel?: string;
};

function validate(fields: ProductInput) {
  const errors: Partial<Record<keyof ProductInput, string>> = {};
  const thumbnail = fields.thumbnail || "";
  if (!fields.title.trim() || fields.title.trim().length < 3)
    errors.title = "Title must be at least 3 characters.";
  if (!fields.category.trim()) errors.category = "Category is required.";
  if (!Number.isFinite(fields.price) || fields.price <= 0)
    errors.price = "Price must be greater than 0.";
  if (!Number.isFinite(fields.stock) || fields.stock < 0)
    errors.stock = "Stock must be 0 or higher.";
  if (!fields.description.trim() || fields.description.trim().length < 10)
    errors.description = "Description must be at least 10 characters.";
  if (thumbnail && !/^https?:\/\/.+/i.test(thumbnail.trim()))
    errors.thumbnail = "Enter a valid URL or leave this blank.";
  return errors;
}

export default function ProductForm({
  initialValues,
  onSubmit,
  submitting,
  submitLabel = "Save product",
}: Props) {
  const [fields, setFields] = useState<ProductInput>({
    title: initialValues?.title || "",
    category: initialValues?.category || "",
    price: initialValues?.price ?? 0,
    stock: initialValues?.stock ?? 0,
    description: initialValues?.description || "",
    thumbnail: initialValues?.thumbnail || "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductInput, string>>
  >({});

  function update(field: keyof ProductInput, value: string) {
    setFields((current) => ({
      ...current,
      [field]: field === "price" || field === "stock" ? Number(value) : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    onSubmit({
      ...fields,
      title: fields.title.trim(),
      category: fields.category.trim(),
      description: fields.description.trim(),
      thumbnail: (fields.thumbnail || "").trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" error={errors.title} wide>
          <input
            id="title"
            value={fields.title}
            onChange={(event) => update("title", event.target.value)}
            className="input"
          />
        </Field>
        <Field label="Category" error={errors.category}>
          <input
            id="category"
            value={fields.category}
            onChange={(event) => update("category", event.target.value)}
            placeholder="e.g. smartphones"
            className="input"
          />
        </Field>
        <Field label="Price ($)" error={errors.price}>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={fields.price}
            onChange={(event) => update("price", event.target.value)}
            className="input"
          />
        </Field>
        <Field label="Stock" error={errors.stock}>
          <input
            id="stock"
            type="number"
            min="0"
            value={fields.stock}
            onChange={(event) => update("stock", event.target.value)}
            className="input"
          />
        </Field>
        <Field label="Thumbnail URL (optional)" error={errors.thumbnail} wide>
          <input
            id="thumbnail"
            value={fields.thumbnail}
            onChange={(event) => update("thumbnail", event.target.value)}
            placeholder="https://..."
            className="input"
          />
        </Field>
        <Field label="Description" error={errors.description} wide>
          <textarea
            id="description"
            value={fields.description}
            onChange={(event) => update("description", event.target.value)}
            className="input min-h-32 resize-y"
          />
        </Field>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-2xl border border-violet-300/30 bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  wide,
  children,
}: {
  label: string;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label
        htmlFor={label.toLowerCase().split(" ")[0]}
        className="mb-2 block text-sm font-medium text-slate-200"
      >
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-xs text-rose-200">{error}</p> : null}
    </div>
  );
}
