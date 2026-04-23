interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

const TableSkeleton = ({ columns, rows = 5 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse border-b border-slate-100 dark:border-white/5 last:border-0">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div
                className={`h-4 bg-slate-200 dark:bg-white/10 rounded mx-auto ${
                  // إعطاء عروض مختلفة عشوائياً للأعمدة لتبدو أكثر واقعية
                  colIndex === 0 ? "w-8" : colIndex === columns - 1 ? "w-20" : "w-24 md:w-32"
                }`}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
