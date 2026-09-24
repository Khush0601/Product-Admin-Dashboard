import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-6 text-center text-rose-100"
      role="alert"
    >
      <AlertCircle className="mx-auto h-8 w-8" />
      <p className="mt-3 text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200/25 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/15"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
