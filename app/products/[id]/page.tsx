'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Pencil, Star, XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import ErrorState from '@/components/ErrorState';
import Loader from '@/components/Loader';
import api from '@/lib/axios';
import { findCreatedById, getSingleWithOverrides } from '@/lib/localProducts';
import { getProductImage, type Product } from '@/lib/products';

type ProductReview = {
    reviewerName: string;
    rating: number;
    comment: string;
};

type ProductWithReviews = Product & {
    reviews?: ProductReview[];
};

type PageStatus = 'loading' | 'ready' | 'error' | 'notfound';

function ProductDetailInner() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductWithReviews | null>(null);
    const [status, setStatus] = useState<PageStatus>('loading');
    const [error, setError] = useState('');

    const loadProduct = useCallback(async () => {
        setStatus('loading');
        setError('');

        try {
            const created = findCreatedById(id);
            const source = created || (await api.get(`/products/${id}`)).data;
            const resolved = getSingleWithOverrides(source);

            if (!resolved) {
                setProduct(null);
                setStatus('notfound');
                return;
            }

            setProduct(resolved as ProductWithReviews);
            setStatus('ready');
        } catch (requestError) {
            const responseStatus = (requestError as { response?: { status?: number }; status?: number }).response?.status
                ?? (requestError as { status?: number }).status;

            if (responseStatus === 404) {
                setProduct(null);
                setStatus('notfound');
                return;
            }

            setError((requestError as { message?: string }).message || 'Failed to load product.');
            setStatus('error');
        }
    }, [id]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadProduct();
        }, 0);
        return () => window.clearTimeout(timer);
    }, [loadProduct]);

    const imageSources = product
        ? product.images?.length
            ? product.images
            : getProductImage(product)
                ? [getProductImage(product)]
                : []
        : [];

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to catalog
            </Link>

            {status === 'loading' && (
                <section className="mt-5 rounded-4xl border border-white/15 bg-white/6 p-8 shadow-[0_25px_80px_rgba(76,29,149,0.25)] backdrop-blur-2xl">
                    <Loader label="Loading product..." />
                </section>
            )}

            {status === 'error' && (
                <section className="mt-5 rounded-4xl border border-white/15 bg-white/6 p-8 shadow-[0_25px_80px_rgba(76,29,149,0.25)] backdrop-blur-2xl">
                    <ErrorState message={error} onRetry={() => void loadProduct()} />
                </section>
            )}

            {status === 'notfound' && (
                <section className="mt-5 rounded-4xl border border-white/15 bg-white/6 p-10 text-center shadow-[0_25px_80px_rgba(76,29,149,0.25)] backdrop-blur-2xl">
                    <XCircle className="mx-auto h-12 w-12 text-violet-200" />
                    <h1 className="mt-4 text-2xl font-semibold text-white">Product not found</h1>
                    <p className="mt-2 text-sm text-slate-400">No product exists with id &quot;{id}&quot;.</p>
                </section>
            )}

            {status === 'ready' && product && (
                <section className="mt-5 overflow-hidden rounded-4xl border border-white/15 bg-white/6 shadow-[0_25px_80px_rgba(76,29,149,0.3)] backdrop-blur-2xl">
                    <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:p-10">
                        <div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {imageSources.length > 0 ? imageSources.map((src, index) => (
                                    <div
                                        key={`${src}-${index}`}
                                        className="relative aspect-square overflow-hidden rounded-3xl border border-white/15 bg-slate-950/30 shadow-inner shadow-blue-950/30 sm:first:col-span-2 sm:first:aspect-[16/10]"
                                    >
                                        <Image
                                            src={src}
                                            alt={`${product.title} image ${index + 1}`}
                                            fill
                                            sizes="(min-width: 1024px) 50vw, 100vw"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )) : (
                                    <div className="flex aspect-[16/10] items-center justify-center rounded-3xl border border-white/15 bg-white/5 text-sm text-slate-400 sm:col-span-2">
                                        No product images available
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Product details</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{product.title}</h1>
                            <p className="mt-2 capitalize text-violet-200">{product.category}</p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <span className="text-3xl font-semibold text-white">${product.price.toFixed(2)}</span>
                                {product.rating ? (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-sm text-amber-100">
                                        <Star className="h-4 w-4 fill-current" />
                                        {product.rating}
                                    </span>
                                ) : null}
                                <span className={product.stock > 0 ? 'inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-100' : 'inline-flex items-center gap-1 rounded-full border border-rose-300/20 bg-rose-400/10 px-3 py-1.5 text-sm text-rose-100'}>
                                    {product.stock > 0 ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>

                            <p className="mt-6 leading-7 text-slate-300">{product.description}</p>

                            <Link
                                href={`/products/edit/${product.id}`}
                                className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:from-violet-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit product
                            </Link>
                        </div>
                    </div>

                    {product.reviews?.length ? (
                        <div className="border-t border-white/10 bg-slate-950/15 px-5 py-7 sm:px-8 lg:px-10">
                            <h2 className="text-lg font-semibold text-white">Customer reviews</h2>
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                {product.reviews.map((review, index) => (
                                    <article key={`${review.reviewerName}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="font-medium text-slate-100">{review.reviewerName}</h3>
                                            <span className="inline-flex items-center gap-1 text-sm text-amber-200">
                                                <Star className="h-3.5 w-3.5 fill-current" />
                                                {review.rating}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">{review.comment}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </section>
            )}
        </main>
    );
}

export default function ProductDetailPage() {
    return (
        <AuthGuard>
            <ProductDetailInner />
        </AuthGuard>
    );
}