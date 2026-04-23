const SkeletonCard = () => (
  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col space-y-4 animate-pulse">
    {/* Card Header */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
      <div className="w-16 h-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
    </div>

    {/* Card Body */}
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>

    {/* Card Footer */}
    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/60">
      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
    </div>
  </div>
);

export default SkeletonCard;
