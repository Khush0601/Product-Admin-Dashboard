'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import ProductForm from '@/components/ProductForm';
import api from '@/lib/axios';
import { recordCreate } from '@/lib/localProducts';
import type { ProductInput } from '@/lib/products';

export default function AddProductPage() {
  return <AuthGuard><AddProductContent /></AuthGuard>;
}

function AddProductContent() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(values: ProductInput) {
    setSubmitting(true);
    setError('');
    try {
      const response = await api.post('/products/add', values);
      recordCreate({ ...values, ...(response.data || {}) });
      router.push('/products');
    } catch (requestError) {
      setError((requestError as { message?: string }).message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6"><Link href="/products" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to catalog</Link><section className="mt-5 rounded-[2rem] border border-white/15 bg-white/6 p-5 shadow-[0_25px_80px_rgba(76,29,149,0.25)] backdrop-blur-2xl sm:p-8"><div className="mb-7 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-200"><PackagePlus className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Catalog action</p><h1 className="mt-2 text-3xl font-semibold text-white">Add product</h1><p className="mt-2 text-sm text-slate-400">Create a new item for the inventory catalog.</p></div></div>{error ? <p className="mb-5 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100" role="alert">{error}</p> : null}<ProductForm submitting={submitting} onSubmit={handleSubmit} submitLabel="Create product" /></section></main>;
}
