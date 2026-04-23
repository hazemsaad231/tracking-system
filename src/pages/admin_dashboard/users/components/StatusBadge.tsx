const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      active
        ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40"
        : "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        active ? "bg-emerald-500 dark:bg-emerald-400" : "bg-red-500 dark:bg-red-400"
      }`}
    />
    {active ? "نشط" : "غير نشط"}
  </span>
);

export default StatusBadge;
