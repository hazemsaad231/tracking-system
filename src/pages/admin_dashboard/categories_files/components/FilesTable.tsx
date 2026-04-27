import type { CategoryFile } from "../types";
import SkeletonRow from "./SkeletonRow";
import SkeletonCard from "./SkeletonCard";

const COLUMNS = ["#", "النوع", "العنوان", "الوصف", "تاريخ الرفع", "إجراءات"];

// ─── Helpers ────────────────────────────────────────────────────────────────
// الـ Backend بيرجع http://localhost بدل الـ domain الحقيقي
// نستبدله بالـ base URL الصح
const STORAGE_BASE = "https://fip.tadbeer.sa/fip_tadbeer/tracking_system";

const fixFileUrl = (url: string): string => {
  if (!url) return "#";
  return url.replace(/^http:\/\/localhost/i, STORAGE_BASE);
};

// اشتقاق نوع الملف من الامتداد (الـ API مش بيبعت file_type)
const getExtension = (f: CategoryFile): string => {
  const path = f.file || f.file_url || "";
  return path.split(".").pop()?.toLowerCase() ?? "";
};


const FileTypeIcon = ({ ext }: { ext: string }) => {
  const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
  if (IMAGE_EXTS.includes(ext))
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </span>
    );
  if (ext === "pdf")
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </span>
    );
  if (["doc", "docx"].includes(ext))
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 8h10M3 5h18M3 19h18" />
        </svg>
      </span>
    );
  // Default file icon
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      {ext && <span className="absolute text-[7px] font-bold mt-3">{ext.toUpperCase()}</span>}
    </span>
  );
};

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  files: CategoryFile[];
  isLoading: boolean;
  onEdit: (file: CategoryFile) => void;
  onDelete: (file: CategoryFile) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function FilesTable({ files, isLoading, onEdit, onDelete }: Props) {
  // ── Loading ──
  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="hidden lg:block">
          <table className="w-full">
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ── Empty ──
  if (files.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400">
        <svg className="mx-auto w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-semibold">لا توجد ملفات</h3>
        <p className="text-sm text-slate-400">ابدأ برفع ملف جديد لعرضه هنا.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden" dir="rtl">
      {/* ── Mobile View - Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
        {files.map((file) => (
          <div key={file.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <FileTypeIcon ext={getExtension(file)} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-white text-sm truncate">{file.title}</p>
                {file.description && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{file.description}</p>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono shrink-0">
                {new Date(file.created_at).toLocaleDateString("ar-EG")}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-white/[0.02]">
              <a
                href={fixFileUrl(file.file_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                عرض
              </a>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(file)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:text-purple-400 dark:hover:bg-purple-500/20 transition-colors"
                  title="تعديل"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(file)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                  title="حذف"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop View - Table ── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
              {COLUMNS.map((h, i) => (
                <th key={i} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {files.map((file, index) => (
              <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-150">
                {/* # */}
                <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-500 text-center">
                  {String(index + 1).padStart(2, "0")}
                </td>

                {/* Type Icon */}
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <FileTypeIcon ext={getExtension(file)} />
                  </div>
                </td>

                {/* Title */}
                <td className="px-6 py-4 text-center">
                  <a
                    href={fixFileUrl(file.file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {file.title}
                  </a>
                </td>

                {/* Description */}
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-center text-xs">
                  {file.description || <span className="italic text-slate-300 dark:text-slate-600">—</span>}
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 text-center font-mono">
                  {new Date(file.created_at).toLocaleDateString("ar-EG")}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(file)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-500/10"
                      title="تعديل"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(file)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10"
                      title="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
