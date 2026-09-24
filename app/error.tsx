'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
            <section className="w-full max-w-xl rounded-4xl border border-rose-300/20 bg-white/6 p-8 text-center shadow-[0_25px_80px_rgba(76,29,149,0.3)] backdrop-blur-2xl sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-rose-300/20 bg-rose-400/10 text-rose-200">
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-rose-200">Something went wrong</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">We hit an unexpected error</h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    Try loading this view again, or return to the catalog and continue working.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:from-violet-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Try again
                    </button>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/7 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to catalog
                    </Link>
                </div>
            </section>
        </main>
    );
}