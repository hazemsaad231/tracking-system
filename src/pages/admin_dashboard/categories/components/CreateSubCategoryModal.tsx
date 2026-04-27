import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api";
import type { Category } from "../types";

// ─── Shared Styles ──────────────────────────────────────────────────────────
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

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  parentCategory: Category | null; // الفئة الأم — لو null → المودال مغلق
  onClose: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function CreateSubCategoryModal({ parentCategory, onClose }: Props) {
  const queryClient = useQueryClient();

  const isOpen = !!parentCategory;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  // إعادة تعيين الفورم عند فتح المودال
  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setNameError("");
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: () =>
      createCategory({
        name: name.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        parent_id: parentCategory!.id, // ← مضمون هنا لأن isOpen=true فقط لو parentCategory موجود
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("اسم الفئة الفرعية مطلوب");
      return;
    }
    setNameError("");
    mutation.mutate();
  };

  const isPending = mutation.isPending;
  const apiError = mutation.error;

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
          transition-all duration-300
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="w-full max-w-md rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10 shrink-0">
            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                إضافة فئة فرعية
              </h2>
              {parentCategory && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  تحت:{" "}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {parentCategory.name}
                  </span>
                </p>
              )}
            </div>
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
          <form id="createSubCategoryForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* API Error */}
            {apiError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30">
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">
                  {(apiError as any).response?.data?.message || (apiError as Error).message}
                </p>
                {(apiError as any).response?.data?.errors && (
                  <ul className="list-disc list-inside text-xs text-red-500 dark:text-red-400 mt-1 space-y-0.5">
                    {Object.values((apiError as any).response.data.errors)
                      .flat()
                      .map((err: any, i) => (
                        <li key={i}>{err}</li>
                      ))}
                  </ul>
                )}
              </div>
            )}

            {/* Parent Info Badge */}
            {parentCategory && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30">
                <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-xs text-purple-700 dark:text-purple-300">
                  الفئة الرئيسية: <strong>{parentCategory.name}</strong> (ID: {parentCategory.id})
                </span>
              </div>
            )}

            <Field label="اسم الفئة الفرعية" error={nameError}>
              <input
                className={inputCls}
                placeholder="مثال: iOS و Android"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field label="الوصف (اختياري)">
              <textarea
                className={`${inputCls} resize-none h-24`}
                placeholder="وصف مختصر..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
              form="createSubCategoryForm"
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
                "إضافة الفئة الفرعية"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
