import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api";
import { fetchRoles } from "../../roles/api";
import type { User, UpdateUserPayload } from "../types";

// ─── Field ───────────────────────────────────────────────────────────────────
const Field = ({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
  </div>
);

const inputCls = `
  w-full px-3 py-2 rounded-lg text-sm
  bg-white border border-slate-200 text-slate-800 placeholder-slate-400
  dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500
  focus:outline-none focus:border-purple-400 dark:focus:border-purple-500
  transition-colors
`;

interface FormState {
  name: string;
  email: string;
  password?: string;
  phone: string;
  is_active: boolean;
  role: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function EditUserModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isOpen = !!user;

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    phone: "",
    is_active: true,
    role: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      const roleVal = user.roles && user.roles.length > 0 ? user.roles[0] : user.role ?? "";
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        phone: user.phone,
        is_active: user.is_active,
        role: roleVal,
      });
      setErrors({});
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(user!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user!.id] }); // Update details cache too
      onClose();
    },
  });

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    staleTime: 5 * 60 * 1000,
  });
  const allRoles = rolesData?.data ?? [];

  const isPending = updateMutation.isPending;
  const apiError = updateMutation.error;

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "الاسم مطلوب";
    if (!form.email.trim()) errs.email = "البريد الإلكتروني مطلوب";
    if (!form.phone.trim()) errs.phone = "رقم الهاتف مطلوب";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    const payload: Partial<UpdateUserPayload> = {
      name: form.name,
      phone: form.phone,
      is_active: form.is_active,
      role: form.role,
      ...(form.password ? { password: form.password } : {}),
    };

    // أرسل البريد الإلكتروني فقط في حال تم تغييره، لتجنب خطأ (مستخدم مسبقاً) من الـ API
    if (form.email !== user.email) {
      payload.email = form.email;
    }

    updateMutation.mutate(payload as UpdateUserPayload);
  };

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <div
        onClick={!isPending ? onClose : undefined}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
      />

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
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
              تعديل المستخدم
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form id="editUserForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            {apiError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30">
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">
                  {(apiError as any).response?.data?.message || (apiError as Error).message}
                </p>
                {(apiError as any).response?.data?.errors && (
                  <ul className="list-disc list-inside text-xs text-red-500 dark:text-red-400 mt-1 space-y-0.5">
                    {Object.values((apiError as any).response.data.errors).flat().map((err: any, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <Field label="الاسم الكامل" error={errors.name}>
              <input
                className={inputCls}
                placeholder="أدخل الاسم الكامل"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>

            <Field label="البريد الإلكتروني" error={errors.email}>
              <input
                type="email"
                className={inputCls}
                placeholder="example@domain.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>

            <Field label="كلمة المرور (اتركها فارغة لعدم التغيير)" error={errors.password}>
              <input
                type="password"
                className={inputCls}
                placeholder="اتركها فارغة لعدم التغيير"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </Field>

            <Field label="رقم الهاتف" error={errors.phone}>
              <input
                className={inputCls}
                placeholder="05xxxxxxxx"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>

            <Field label="الدور">
              <select
                className={inputCls}
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                disabled={rolesLoading}
              >
                {rolesLoading ? (
                  <option>جاري التحميل...</option>
                ) : (
                  <>
                    <option value="">اختر دوراً</option>
                    {allRoles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </Field>

            <Field label="الحالة">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("is_active", !form.is_active)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                    form.is_active ? "bg-emerald-500" : "bg-slate-200 dark:bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      form.is_active ? "translate-x-0" : "-translate-x-5"
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {form.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>
            </Field>
          </form>

          {/* Footer */}
          <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-100 dark:border-white/10 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              إلغاء
            </button>
            <button
              type="submit"
              form="editUserForm"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التعديلات"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
