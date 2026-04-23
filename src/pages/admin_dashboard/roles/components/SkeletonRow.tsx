const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 w-6 bg-slate-200 dark:bg-white/5 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-24 bg-slate-200 dark:bg-white/5 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-slate-200 dark:bg-white/5 rounded-full"></div>
        <div className="h-5 w-16 bg-slate-200 dark:bg-white/5 rounded-full"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-20 bg-slate-200 dark:bg-white/5 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-2 justify-center">
        <div className="h-8 w-8 bg-slate-200 dark:bg-white/5 rounded-lg"></div>
        <div className="h-8 w-8 bg-slate-200 dark:bg-white/5 rounded-lg"></div>
      </div>
    </td>
  </tr>
);

export default SkeletonRow;
