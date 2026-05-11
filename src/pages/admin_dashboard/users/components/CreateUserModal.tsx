import { useEffect, useState } from "react";
import type { CreateUserPayload } from "../types";
import type { Role } from "../../roles/types";
import CustomSelect, { type SelectOption } from "./CustomSelect";

// ─── Field Wrapper ───────────────────────────────────────────────────────────
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

// ─── Constants ───────────────────────────────────────────────────────────────
const EMPTY_FORM: CreateUserPayload = {
  name: "",
  email: "",
  password: "",
  phone: "",
  is_active: true,
  role: "",
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  rolesLoading: boolean;
  onSubmit: (payload: CreateUserPayload) => void;
  isPending: boolean;
  apiError: unknown;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CreateUserModal({
  isOpen,
  onClose,
  roles,
  rolesLoading,
  onSubmit,
  isPending,
  apiError,
}: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserPayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CreateUserPayload>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setShowPassword(false);
    }
  }, [isOpen]);

  const roleOptions: SelectOption[] = roles.map((r) => ({
    label: r.name,
    value: r.name,
  }));

  const validate = () => {
    const errs: Partial<CreateUserPayload> = {};
    if (!form.name.trim()) errs.name = "الاسم مطلوب";
    if (!form.email.trim()) errs.email = "البريد الإلكتروني مطلوب";
    if (!form.password.trim()) errs.password = "كلمة المرور مطلوبة";
    if (!form.phone.trim()) errs.phone = "رقم الهاتف مطلوب";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const set = (field: keyof CreateUserPayload, value: string | boolean) =>
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
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">إضافة مستخدم جديد</h2>
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

          {/* Form */}
          <form id="createUserForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* API Error */}
            {!!apiError && (
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
              <input className={inputCls} placeholder="أدخل الاسم الكامل" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>

            <Field label="البريد الإلكتروني" error={errors.email}>
              <input type="email" className={inputCls} placeholder="example@domain.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>

            <Field label="كلمة المرور" error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputCls} pl-10`}
                  placeholder="أدخل كلمة المرور"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute inset-y-0 left-2 flex items-center justify-center w-7 h-full text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </Field>

            <Field label="رقم الهاتف" error={errors.phone}>
              <input className={inputCls} placeholder="05xxxxxxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>

            {/* Custom Role Dropdown */}
            <Field label="الدور">
              <CustomSelect
                options={roleOptions}
                value={form.role}
                onChange={(v) => set("role", v)}
                placeholder="اختر دوراً"
                isLoading={rolesLoading}
              />
            </Field>

            {/* Status Toggle */}
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
          <div className="flex items-center gap-3 px-5 py-3 border-t border-slate-100 dark:border-white/10 shrink-0">
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
              form="createUserForm"
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
              ) : (
                "إضافة المستخدم"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
