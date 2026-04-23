import { useQuery} from "@tanstack/react-query";
import { fetchUserById} from "../api";
import type { User } from "../types";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";

// ─── Detail Info Row ──────────────────────────────────────────────────────────
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-1 py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
    <span className="text-xs text-slate-400 dark:text-slate-500">{label}</span>
    <div className="text-sm font-medium text-slate-800 dark:text-white">{value}</div>
  </div>
);

// ─── Detail Skeleton ──────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="animate-pulse space-y-4 p-6">
    <div className="flex flex-col items-center gap-3 pb-6">
      <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-white/10" />
      <div className="h-5 w-36 rounded-full bg-slate-200 dark:bg-white/10" />
      <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-white/5" />
    </div>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-1">
        <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-white/5" />
        <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-white/10" />
      </div>
    ))}
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────
interface UserDetailPanelProps {
  userId: number | null;
  onClose: () => void;
  onDeleted: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
const UserDetailPanel = ({ userId, onClose}: UserDetailPanelProps) => {
  const isOpen = userId !== null;

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId!),
    enabled: isOpen,
  });


  const roles =
    user?.roles && user.roles.length > 0 ? user.roles : [user?.role ?? "مستخدم"];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-Over Panel */}
      <div
        dir="rtl"
        className={`
          fixed top-0 right-0 h-full z-50 w-full max-w-sm
          bg-white dark:bg-slate-900
          border-l border-slate-200 dark:border-white/10
          shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10 shrink-0">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">
            تفاصيل المستخدم
          </h2>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <DetailSkeleton />
          ) : user ? (
            <div className="p-6 space-y-1">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-3 pb-6 mb-4 border-b border-slate-100 dark:border-white/10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    #{user.id}
                  </p>
                </div>
                <StatusBadge active={user.is_active} />
              </div>

              {/* Info Rows */}
              <DetailRow
                label="البريد الإلكتروني"
                value={<span className="font-mono text-xs break-all">{user.email}</span>}
              />
              <DetailRow
                label="رقم الهاتف"
                value={<span className="font-mono tracking-wider">{user.phone}</span>}
              />
              <DetailRow
                label="الأدوار"
                value={
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {roles.map((r) => (
                      <RoleBadge key={r} role={r} />
                    ))}
                  </div>
                }
              />
              {user.created_at && (
                <DetailRow
                  label="تاريخ الإنشاء"
                  value={new Date(user.created_at).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              )}
              <DetailRow label="الحالة" value={<StatusBadge active={user.is_active} />} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400 dark:text-slate-500 text-sm">لا توجد بيانات</p>
            </div>
          )}
        </div>

       
      </div>

 
    </>
  );
};

export default UserDetailPanel;
