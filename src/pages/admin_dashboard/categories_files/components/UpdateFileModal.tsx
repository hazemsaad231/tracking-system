import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFile } from "../api";
import type { CategoryFile } from "../types";

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  file: CategoryFile | null; // null → modal مغلق
  categoryId: number;
  onClose: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function UpdateFileModal({ file, categoryId, onClose }: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = !!file;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [titleError, setTitleError] = useState("");

  // إعادة تعيين الفورم عند فتح المودال بقيم الملف الحالية
  useEffect(() => {
    if (isOpen && file) {
      setTitle(file.title ?? "");
      setDescription(file.description ?? "");
      setSelectedFile(null);
      setTitleError("");
    }
  }, [isOpen, file]);

  const mutation = useMutation({
    mutationFn: () =>
      updateFile(categoryId, file!.id, {
        file: selectedFile!, // required by type, but we'll handle in api
        title: title.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-files", categoryId] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError("عنوان الملف مطلوب");
      return;
    }
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
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">تعديل الملف</h2>
              {file && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {file.title}
                </p>
              )}
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

          {/* Form */}
          <form id="updateFileForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
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

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                عنوان الملف <span className="text-red-500">*</span>
              </label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
                className={`w-full px-3 py-2 rounded-lg text-sm bg-white border text-slate-800 placeholder-slate-400 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors ${
                  titleError ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-white/10"
                }`}
              />
              {titleError && <p className="text-xs text-red-500 dark:text-red-400">{titleError}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">الوصف (اختياري)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر..."
                className="w-full px-3 py-2 rounded-lg text-sm resize-none bg-white border border-slate-200 text-slate-800 placeholder-slate-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Replace File (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                استبدال الملف (اختياري)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-dashed border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {selectedFile ? selectedFile.name : "انقر لاختيار ملف جديد..."}
                </span>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="mr-auto text-xs text-red-400 hover:text-red-600 shrink-0"
                  >
                    إزالة
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
              {!selectedFile && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  اتركه فارغاً للإبقاء على الملف الحالي
                </p>
              )}
            </div>
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
              form="updateFileForm"
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
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  حفظ التعديلات
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
