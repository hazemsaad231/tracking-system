// ─── Skeleton Row for loading state ────────────────────────────────────────
export default function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700/40">
      <td className="px-4 py-3"><div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
      <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-5 w-6 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /></td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}
