'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import ProductForm from '@/components/ProductForm';
import Loader from '@/components/Loader';
import ErrorState from '@/components/ErrorState';
import api from '@/lib/axios';
import { findCreatedById, getSingleWithOverrides, recordEdit } from '@/lib/localProducts';
import type { Product, ProductInput } from '@/lib/products';

export default function EditProductPage() {
  return <AuthGuard><EditProductContent /></AuthGuard>;
}

function EditProductContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadProduct = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      const created = findCreatedById(params.id);
      const source = created || (await api.get(`/products/${params.id}`)).data;
      const resolved = getSingleWithOverrides(source);
      if (!resolved) throw new Error('This product is no longer available.');
      setProduct(resolved);
      setStatus('ready');
    } catch (requestError) {
      setError((requestError as { message?: string }).message || 'Failed to load product.');
      setStatus('error');
    }
  }, [params.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadProduct(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadProduct]);

  async function handleSubmit(values: ProductInput) {
    if (!product) return;
    setSubmitting(true);
    setError('');
    try {
      await api.put(`/products/${product.id}`, values);
      recordEdit(product.id, values);
      router.push('/products');
    } catch (requestError) {
      setError((requestError as { message?: string }).message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6"><Link href="/products" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to catalog</Link><section className="mt-5 rounded-4xl border border-white/15 bg-white/6 p-5 shadow-[0_25px_80px_rgba(76,29,149,0.25)] backdrop-blur-2xl sm:p-8">{status === 'loading' ? <Loader label="Loading product..." /> : status === 'error' ? <ErrorState message={error} onRetry={loadProduct} /> : product ? <><div className="mb-7 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-200"><Pencil className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Catalog action</p><h1 className="mt-2 text-3xl font-semibold text-white">Edit product</h1><p className="mt-2 text-sm text-slate-400">Update the details for {product.title}.</p></div></div>{error ? <p className="mb-5 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100" role="alert">{error}</p> : null}<ProductForm key={String(product.id)} initialValues={product} submitting={submitting} onSubmit={handleSubmit} submitLabel="Save changes" /></> : null}</section></main>;
}
