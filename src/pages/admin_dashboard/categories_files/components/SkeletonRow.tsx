// ─── Skeleton Row ────────────────────────────────────────────────────────────
export default function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-white/5">
      <td className="px-6 py-4"><div className="h-4 w-6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" /></td>
      <td className="px-6 py-4"><div className="h-5 w-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" /></td>
      <td className="px-6 py-4"><div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" /></td>
      <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" /></td>
      <td className="px-6 py-4"><div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto" /></td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}
