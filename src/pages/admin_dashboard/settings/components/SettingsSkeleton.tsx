const SettingsSkeleton = () => (
  <div className="space-y-6 animate-pulse max-w-6xl m-auto" dir="rtl">
    {[1, 2].map((section) => (
      <div
        key={section}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        <div className="flex items-center gap-3 p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-white/5"></div>
          <div className="h-5 w-24 bg-slate-200 dark:bg-white/5 rounded"></div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between px-6 py-4">
              <div className="h-4 w-28 bg-slate-200 dark:bg-white/5 rounded"></div>
              <div className="h-4 w-40 bg-slate-200 dark:bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default SettingsSkeleton;
