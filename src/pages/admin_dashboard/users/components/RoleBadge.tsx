// ─── Helpers ─────────────────────────────────────────────────────────────────
export const getRoleColor = (role: string): string => {
  const map: Record<string, string> = {
    admin:
      "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40",
    client:
      "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40",
    accountant:
      "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40",
    reviewer:
      "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/40",
  };
  const key = Object.keys(map).find((k) => role.toLowerCase().includes(k));
  return key
    ? map[key]
    : "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/40";
};

// ─── Role Badge ──────────────────────────────────────────────────────────────
const RoleBadge = ({ role }: { role: string }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)}`}
  >
    {role}
  </span>
);

export default RoleBadge;
