import type { User, ApiResponse } from "../types";
import StatusBadge from "./StatusBadge";
import SkeletonRow from "./SkeletonRow";
import SkeletonCard from "./SkeletonCard";

// ─── Table Header Columns ─────────────────────────────────────────────────────
const COLUMNS = ["#", "الاسم", "البريد الإلكتروني", "رقم الهاتف", "الحالة", "إجراءات"];

// ─── Props ────────────────────────────────────────────────────────────────────
interface UsersTableProps {
  users: User[];
  meta: ApiResponse["meta"] | undefined;
  isLoading: boolean;
  onView: (id: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const UsersTable = ({
  users,
  meta,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: UsersTableProps) => {
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

  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400">
        <svg className="mx-auto w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 0a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm7 14a4 4 0 0 0-8 0" /></svg>
        <h3 className="mt-2 text-lg font-semibold">لا يوجد مستخدمون</h3>
        <p className="text-sm text-slate-400">ابدأ بإضافة مستخدم جديد لعرضه هنا.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Mobile View - Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
        {users.map((user) => (
          <div key={user.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col space-y-4">
            {/* Card Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
              <StatusBadge active={user.is_active} />
            </div>

            {/* Card Body */}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="font-sans">الهاتف: </span>
              <span className="tracking-wider">{user.phone}</span>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/60">
              <button
                onClick={() => onView(user.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                title="عرض التفاصيل"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              <button
                onClick={() => onEdit(user)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:text-purple-400 dark:hover:bg-purple-500/20 transition-colors"
                title="تعديل"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button
                onClick={() => onDelete(user)}
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
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-center">
          {/* Head */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
              {COLUMNS.map((h, i) => (
                <th key={i} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          {/* Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-150">
                <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-500">{String(index + 1).padStart(2, "0")}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-white">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-300">{user.email}</td>
                <td className="px-6 py-4 font-mono tracking-wider text-slate-600 dark:text-slate-300">{user.phone}</td>
                <td className="px-6 py-4"><StatusBadge active={user.is_active} /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onView(user.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10" title="عرض التفاصيل">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button onClick={() => onEdit(user)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-500/10" title="تعديل">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => onDelete(user)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10" title="حذف">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {meta && (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-slate-200/80 rounded-b-xl dark:border-white/10 dark:bg-white/[0.02]">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            الصفحة {meta.current_page} من {meta.last_page}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            إجمالي المستخدمين:{" "}
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              {meta.total}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
