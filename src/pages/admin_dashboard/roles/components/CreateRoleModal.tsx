import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "../api";
import { AVAILABLE_PERMISSIONS } from "../types";
import type { CreateRolePayload } from "../types";

const Field = ({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) => (
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

const EMPTY_FORM: CreateRolePayload = { name: "", permissions: [] };

export default function CreateRoleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateRolePayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CreateRolePayload>>({});

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      onClose();
    },
  });

  const isPending = mutation.isPending;
  const apiError = mutation.error;

  const validate = () => {
    const errs: Partial<CreateRolePayload> = {};
    if (!form.name.trim()) errs.name = "اسم الدور مطلوب";
    if (form.permissions.length === 0) errs.permissions = "يجب اختيار صلاحية واحدة على الأقل" as any;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(form);
  };

  const togglePermission = (permValue: string) => {
    setForm((prev) => {
      const isSelected = prev.permissions.includes(permValue);
      return {
        ...prev,
        permissions: isSelected
          ? prev.permissions.filter((p) => p !== permValue)
          : [...prev.permissions, permValue],
      };
    });
  };

  return (
    <>
      <div
        onClick={!isPending ? onClose : undefined}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 bg-black/50 dark:bg-black/70 backdrop-blur-sm" : "opacity-0 pointer-events-none"
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
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">إضافة دور جديد</h2>
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
          <form id="createRoleForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
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

            <Field label="اسم الدور" error={errors.name}>
              <input
                className={inputCls}
                placeholder="مثال: مدير المبيعات"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>

            <Field label="الصلاحيات الممنوحة" error={errors.permissions as unknown as string}>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label
                    key={perm.value}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(perm.value)}
                        onChange={() => togglePermission(perm.value)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 peer-checked:bg-purple-600 peer-checked:border-purple-600 dark:peer-checked:bg-purple-500 dark:peer-checked:border-purple-500 transition-colors flex items-center justify-center">
                        <svg className={`w-3.5 h-3.5 text-white ${form.permissions.includes(perm.value) ? 'opacity-100' : 'opacity-0'} transition-opacity`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{perm.label}</span>
                      <span className="text-xs text-slate-400 font-mono">{perm.value}</span>
                    </div>
                  </label>
                ))}
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
              form="createRoleForm"
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
                "إضافة الدور"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
