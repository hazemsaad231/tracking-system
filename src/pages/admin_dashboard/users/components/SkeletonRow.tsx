const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 rounded-full bg-slate-200 dark:bg-white/5 w-full" />
      </td>
    ))}
  </tr>
);

export default SkeletonRow;
