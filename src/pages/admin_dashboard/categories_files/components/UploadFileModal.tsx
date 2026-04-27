import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../api";

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function UploadFileModal({ isOpen, onClose, categoryId }: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setTitle("");
      setTitleError("");
      setFileError("");
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: () => uploadFile(categoryId, { file: selectedFile!, title: title.trim() }),
    onSuccess: (uploadedFile) => {
      console.log("✅ Upload response:", uploadedFile); // للتحقق من الـ response

      // ── Optimistic Update: أضف الملف فوراً للقائمة ──
      queryClient.setQueryData(
        ["category-files", categoryId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: [uploadedFile, ...(old.data ?? [])],
            meta: { ...old.meta, total: (old.meta?.total ?? 0) + 1 },
          };
        }
      );

      // ── ثم refetch من الـ server للتزامن ──
      queryClient.invalidateQueries({ queryKey: ["category-files", categoryId] });
      onClose();
    },
  });

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, "")); // عنوان من اسم الملف بدون امتداد
    setFileError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!selectedFile) {
      setFileError("يرجى اختيار ملف للرفع");
      valid = false;
    }
    if (!title.trim()) {
      setTitleError("عنوان الملف مطلوب");
      valid = false;
    }
    if (!valid) return;
    mutation.mutate();
  };

  const isPending = mutation.isPending;
  const apiError = mutation.error;

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">رفع ملف جديد</h2>
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
          <form id="uploadFileForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* API Error */}
            {apiError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30">
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  {(apiError as any).response?.data?.message || (apiError as Error).message}
                </p>
              </div>
            )}

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                ${dragOver
                  ? "border-purple-400 bg-purple-50 dark:bg-purple-500/10"
                  : "border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400">{formatSize(selectedFile.size)}</p>
                  <p className="text-xs text-purple-500 dark:text-purple-400">انقر لتغيير الملف</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">اسحب الملف هنا أو انقر للاختيار</p>
                  <p className="text-xs text-slate-400">يدعم جميع أنواع الملفات</p>
                </div>
              )}
            </div>
            {fileError && <p className="text-xs text-red-500 dark:text-red-400 -mt-2">{fileError}</p>}

            {/* Title Field — Required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                عنوان الملف <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="عنوان وصفي للملف..."
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
                className={`w-full px-3 py-2 rounded-lg text-sm bg-white border text-slate-800 placeholder-slate-400 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors ${
                  titleError ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-white/10"
                }`}
              />
              {titleError && <p className="text-xs text-red-500 dark:text-red-400">{titleError}</p>}
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
              form="uploadFileForm"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  جاري الرفع...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  رفع الملف
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
