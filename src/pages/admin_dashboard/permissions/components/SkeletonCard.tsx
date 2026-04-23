const SkeletonCard = () => (
  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col space-y-3 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/5"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
    </div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/60">
      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
    </div>
  </div>
);

export default SkeletonCard;
