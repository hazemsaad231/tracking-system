import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser } from "../api";
import { USER_ROLES } from "../types";
import type { User, CreateUserPayload, UpdateUserPayload, UserRole } from "../types";

// ─── Props ────────────────────────────────────────────────────────────────────
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editUser?: User | null; // if provided → edit mode
}

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

// ─── Initial Form State ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  is_active: true,
  role: "client" as UserRole,
};

// ─── Component ───────────────────────────────────────────────────────────────
const UserFormModal = ({ isOpen, onClose, editUser }: UserFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!editUser;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});

  // Populate form when editing
  useEffect(() => {
    if (editUser) {
      const roleVal = (
        editUser.roles && editUser.roles.length > 0
          ? editUser.roles[0]
          : editUser.role ?? "client"
      ) as UserRole;
      setForm({
        name: editUser.name,
        email: editUser.email,
        password: "",
        phone: editUser.phone,
        is_active: editUser.is_active,
        role: roleVal,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editUser, isOpen]);

  // ── Mutations ──
  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(editUser!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", editUser!.id] });
      onClose();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const apiError = createMutation.error || updateMutation.error;

  // ── Validation ──
  const validate = () => {
    const errs: Partial<typeof EMPTY_FORM> = {};
    if (!form.name.trim()) errs.name = "الاسم مطلوب";
    if (!form.email.trim()) errs.email = "البريد الإلكتروني مطلوب";
    if (!isEditMode && !form.password.trim()) errs.password = "كلمة المرور مطلوبة";
    if (!form.phone.trim()) errs.phone = "رقم الهاتف مطلوب";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode) {
      const payload: Partial<UpdateUserPayload> = {
        name: form.name,
        phone: form.phone,
        is_active: form.is_active,
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
      };
      
      // أرسل البريد الإلكتروني فقط في حال تم تغييره، لتجنب خطأ (مستخدم مسبقاً) من الـ API
      if (form.email !== editUser!.email) {
        payload.email = form.email;
      }

      updateMutation.mutate(payload as UpdateUserPayload);
    } else {
      createMutation.mutate(form as CreateUserPayload);
    }
  };

  const set = (field: keyof typeof EMPTY_FORM, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={!isPending ? onClose : undefined}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Modal */}
      <div
        dir="rtl"
        role="dialog"
        aria-modal="true"
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          pointer-events-none
          transition-all duration-300
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <div className="pointer-events-auto w-full max-w-md rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10 shrink-0">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
              {isEditMode ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              aria-label="إغلاق"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* API Error */}
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

            <Field
              label={isEditMode ? "كلمة المرور (اتركها فارغة لعدم التغيير)" : "كلمة المرور"}
              error={errors.password}
            >
              <input
                type="password"
                className={inputCls}
                placeholder={isEditMode ? "اتركها فارغة لعدم التغيير" : "أدخل كلمة المرور"}
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
              >
                {USER_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="الحالة">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("is_active", !form.is_active)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    form.is_active
                      ? "bg-emerald-500"
                      : "bg-slate-200 dark:bg-white/10"
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
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              form=""
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  جاري الحفظ...
                </>
              ) : isEditMode ? (
                "حفظ التعديلات"
              ) : (
                "إضافة المستخدم"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFormModal;
