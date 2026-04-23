import type { Permission } from "../types";
import SkeletonRow from "./SkeletonRow";

const COLUMNS = ["#", "اسم الصلاحية", "تاريخ الإنشاء", "إجراءات"];

interface PermissionsTableProps {
  permissions: Permission[];
  isLoading: boolean;
  onDelete: (permission: Permission) => void;
}

const PermissionsTable = ({ permissions, isLoading, onDelete }: PermissionsTableProps) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400">
        <svg className="mx-auto w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <h3 className="mt-2 text-lg font-semibold">لا توجد صلاحيات</h3>
        <p className="text-sm text-slate-400">ابدأ بإضافة صلاحية جديدة لعرضها هنا.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile View - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
        {permissions.map((perm, index) => (
          <div key={perm.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg font-mono text-xs">
                {perm.name}
              </span>
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="flex-grow" />
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="font-sans">تاريخ الإنشاء: </span>
                {perm.created_at ? new Date(perm.created_at).toLocaleDateString("en-GB") : "—"}
              </div>
              <button
                onClick={() => onDelete(perm)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                title="حذف"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
              {COLUMNS.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-slate-500 dark:text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-right">
            {permissions.map((perm, index) => (
              <tr
                key={perm.id}
                className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-150"
              >
                <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-500 text-center">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg font-mono text-xs">
                    {perm.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 text-center font-mono">
                  {perm.created_at ? new Date(perm.created_at).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onDelete(perm)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                      title="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionsTable;
