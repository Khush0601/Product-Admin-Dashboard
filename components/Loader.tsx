export default function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-300"
      role="status"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300" />
      {label}
    </div>
  );
}
