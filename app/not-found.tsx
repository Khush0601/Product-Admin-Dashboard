import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
            <section className="w-full max-w-xl rounded-4xl border border-white/15 bg-white/6 p-8 text-center shadow-[0_25px_80px_rgba(76,29,149,0.3)] backdrop-blur-2xl sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
                    <SearchX className="h-8 w-8" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">Page unavailable</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Page not found</h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    The page you are looking for does not exist or may have moved.
                </p>
                <Link
                    href="/products"
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:from-violet-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to catalog
                </Link>
            </section>
        </main>
    );
}