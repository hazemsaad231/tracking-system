import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAssignments, assignStaff, unassignStaff, fetchUsers } from "../api";
import type { User, AssignmentStaff, AssignmentsApiResponse } from "../types";


// ─── Props ────────────────────────────────────────────────────────────────────
interface AssignStaffModalProps {
  client: User | null;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AssignStaffModal({ client, onClose }: AssignStaffModalProps) {
  const queryClient = useQueryClient();
  const isOpen = !!client;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // ── Fetch current assignments ──
  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["assignments", client?.id],
    queryFn: () => fetchAssignments(client!.id),
    enabled: isOpen,
  });

  // ── Fetch all users ──
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
    staleTime: 60_000,
  });

  const allUsers: User[] = usersData?.data ?? [];


  // الـ Staff المعينين حالياً (من الـ API)
  const assignedStaff: AssignmentStaff[] =
    (assignmentsData as AssignmentsApiResponse | undefined)?.data?.assigned_staff ?? [];


  const assignedIds = assignedStaff.map((s) => s.id);

  // الـ Staff الغير معينين (لإضافتهم) اللي دورهم محاسب أو مراجع أو كاتب
  const allowedStaffRoles = ["accountant", "reviewer", "writer"];
  const unassignedStaff = allUsers.filter((u) => {
    const isAllowedRole =
      (u.roles && u.roles.some((r) => allowedStaffRoles.includes(r.toLowerCase()))) ||
      (u.role && allowedStaffRoles.includes(u.role.toLowerCase()));

    return u.id !== client?.id && !assignedIds.includes(u.id) && isAllowedRole;
  });

  // ── Sync selectedIds ──
  useEffect(() => {
    if (!isOpen) {
      setSelectedIds([]);
      setSearch("");
      setSuccessMsg(null);
      return;
    }
    setSelectedIds([]);
  }, [isOpen]);

  // ── Mutation: إضافة Staff جديد ──
  const syncMutation = useMutation({
    mutationFn: (ids: number[]) => assignStaff(client!.id, ids),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", client?.id] });
      setSuccessMsg("تم إضافة Staff بنجاح");
      setSelectedIds([]);
      setTimeout(() => setSuccessMsg(null), 2000);
    },
  });

  // ── Mutation: حذف Staff مباشرة ──
  const unassignMutation = useMutation({
    mutationFn: (staffId: number) => unassignStaff(client!.id, [staffId]),
    onMutate: (staffId) => setRemovingId(staffId),
    onSettled: () => setRemovingId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", client?.id] });
    },
  });

  const isPending = syncMutation.isPending;
  const apiError = syncMutation.error ?? unassignMutation.error;

  const toggleStaff = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSave = () => {
    if (selectedIds.length === 0) return;
    syncMutation.mutate(selectedIds);
  };

  // ── Filtered unassigned list ──
  const filteredUnassigned = unassignedStaff.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const isLoading = assignmentsLoading || usersLoading;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={!isPending ? onClose : undefined}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 bg-black/50 dark:bg-black/70 backdrop-blur-sm" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Modal */}
      <div
        dir="rtl"
        role="dialog"
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          transition-all duration-300
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="w-full max-w-md rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10 shrink-0">
            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">إدارة Staff للعميل</h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{client?.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Success / Error */}
            {successMsg && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-500/10 dark:border-green-500/30 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">{successMsg}</p>
              </div>
            )}
            {apiError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30">
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  {(apiError as any).response?.data?.message || (apiError as Error).message}
                </p>
              </div>
            )}

            {/* ── القسم الأول: المعينون حالياً ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  المعينون حالياً
                </h3>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full">
                  {assignedStaff.length}
                </span>
              </div>

              {assignmentsLoading ? (
                <div className="h-12 rounded-lg bg-slate-100 dark:bg-white/5 animate-pulse" />
              ) : assignedStaff.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4 rounded-lg border border-dashed border-slate-200 dark:border-white/10">
                  لا يوجد Staff معين لهذا العميل
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {assignedStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{staff.name}</span>
                        <span className="text-xs text-slate-400 font-mono truncate">{staff.email}</span>
                      </div>
                      {/* زرار الحذف المباشر */}
                      <button
                        onClick={() => unassignMutation.mutate(staff.id)}
                        disabled={removingId === staff.id}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-500/20 transition-colors disabled:opacity-40 shrink-0"
                        title="إلغاء التعيين"
                      >
                        {removingId === staff.id ? (
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-white/10" />

            {/* ── القسم الثاني: إضافة Staff ── */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                إضافة Staff
              </h3>

              {/* Search */}
              <div className="relative mb-3">
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="بحث في Staff..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-lg text-sm bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors"
                />
              </div>

              {/* List */}
              <div className="grid grid-cols-1 gap-2">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-white/5 animate-pulse" />
                  ))
                ) : filteredUnassigned.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
                    {search ? "لا توجد نتائج" : "جميع الـ Staff تم تعيينهم بالفعل"}
                  </p>
                ) : (
                  filteredUnassigned.map((staff) => (
                    <label
                      key={staff.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] cursor-pointer transition-colors"
                    >
                      <div className="relative flex items-center shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(staff.id)}
                          onChange={(e) => toggleStaff(staff.id, e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 peer-checked:bg-purple-600 peer-checked:border-purple-600 dark:peer-checked:bg-purple-500 dark:peer-checked:border-purple-500 transition-colors flex items-center justify-center">
                          {selectedIds.includes(staff.id) && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{staff.name}</span>
                        <span className="text-xs text-slate-400 font-mono truncate">{staff.email}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-100 dark:border-white/10 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              إغلاق
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || selectedIds.length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  جاري الإضافة...
                </>
              ) : (
                `إضافة ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""}`
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
