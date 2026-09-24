import { PackageOpen } from "lucide-react";

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center text-center text-slate-300">
      <PackageOpen className="h-10 w-10 text-violet-300" />
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}
