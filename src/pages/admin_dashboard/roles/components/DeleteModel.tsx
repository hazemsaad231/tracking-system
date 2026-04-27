
import type { Role } from "../types";



// ─── Delete Confirm Modal ──────────────────────────────────────────────────
const DeleteConfirmModal = ({
  role,
  onClose,
  onConfirm,
  isPending,
}: {
  role: Role | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) => {
  if (!role) return null;

  return (
    <>
      <div
        onClick={!isPending ? onClose : undefined}
        className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />
      <div
        dir="rtl"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-sm rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            حذف الدور
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            هل أنت متأكد من أنك تريد حذف الدور <span className="font-semibold text-slate-700 dark:text-slate-300">{role.name}</span>؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  جاري الحذف...
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
    