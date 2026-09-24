export default function Loading() {
    return (
        <main
            className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6"
            aria-busy="true"
            aria-live="polite"
        >
            <section
                className="w-full max-w-xl rounded-4xl border border-white/12 bg-white/6 p-8 text-center shadow-[0_25px_80px_rgba(76,29,149,0.3)] backdrop-blur-2xl sm:p-12"
                role="status"
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-300/20 bg-gradient-to-br from-violet-400/15 to-blue-400/15">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                    Please wait
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Loading your workspace
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    We are getting the latest product information ready for you.
                </p>
            </section>
        </main>
    );
}