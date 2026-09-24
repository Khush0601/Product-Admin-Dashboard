import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 p-6 shadow-[0_25px_80px_rgba(76,29,149,0.45)] backdrop-blur-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-400/15 text-rose-200">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h2 id="confirm-title" className="font-semibold text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-xl bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
