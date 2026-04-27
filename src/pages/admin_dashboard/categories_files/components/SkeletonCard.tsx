// ─── Skeleton Card (Mobile) ────────────────────────────────────────────────
export default function SkeletonCard() {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/60">
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
