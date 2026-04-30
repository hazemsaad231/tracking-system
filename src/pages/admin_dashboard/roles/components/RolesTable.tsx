import type { Role } from "../types";
import SkeletonRow from "./SkeletonRow";
import SkeletonCard from "./SkeletonCard";
import PermissionBadge from "./PermissionBadge";

const COLUMNS = ["#", "اسم الدور", "الصلاحيات", "تاريخ الإنشاء", "إجراءات"];

interface RolesTableProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

const RolesTable = ({ roles, isLoading, onEdit, onDelete }: RolesTableProps) => {
  if (isLoading) {
    return (
      <>
        {/* Mobile Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        {/* Desktop Skeleton */}
        <div className="hidden lg:block">
          <table className="w-full">
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400">
        <svg className="mx-auto w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 0a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm7 14a4 4 0 0 0-8 0" /></svg>
        <h3 className="mt-2 text-lg font-semibold">لا توجد أدوار</h3>
        <p className="text-sm text-slate-400">ابدأ بإضافة دور جديد لعرضه هنا.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Mobile View - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
        {roles.map((role) => (
          <div key={role.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col space-y-4">
            {/* Card Header */}
            <div className="flex justify-between items-start">
              <span className="font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg">
                {role.name}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="font-sans">تاريخ الإنشاء: </span>
                {role.created_at ? new Date(role.created_at).toLocaleDateString("en-GB") : "—"}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">الصلاحيات:</h4>
              <div className="flex flex-wrap items-center gap-1.5">
                {role.permissions?.length > 0 ? (
                  role.permissions.map((p) => <PermissionBadge key={p} permission={p} />)
                ) : (
                  <span className="text-xs text-slate-400">لا توجد صلاحيات</span>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/60">
              <button
                onClick={() => onEdit(role)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:text-purple-400 dark:hover:bg-purple-500/20 transition-colors"
                title="تعديل"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button
                onClick={() => onDelete(role)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                title="حذف"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block overflow-x-auto py-5">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
              {COLUMNS.map((h, i) => (
                <th key={i} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-right">
            {roles.map((role, index) => (
              <tr key={role.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-150">
                <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-500 text-center">{String(index + 1).padStart(2, "0")}</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg">{role.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md mx-auto">
                    {role.permissions?.length > 0 ? (
                      role.permissions.map((p) => <PermissionBadge key={p} permission={p} />)
                    ) : (
                      <span className="text-xs text-slate-400">لا توجد صلاحيات</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 text-center font-mono">
                  {role.created_at ? new Date(role.created_at).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(role)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-500/10" title="تعديل">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => onDelete(role)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10" title="حذف">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesTable;
