import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategoryFiles, deleteFile } from "./api";
import type { CategoryFilesApiResponse, CategoryFile } from "./types";
import FilesTable from "./components/FilesTable";
import UploadFileModal from "./components/UploadFileModal";
import UpdateFileModal from "./components/UpdateFileModal";
import DeleteFileModal from "./components/DeleteFileModal";

// ─── Page Component ───────────────────────────────────────────────────────────
const CategoryFiles = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const catId = Number(categoryId);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingFile, setEditingFile] = useState<CategoryFile | null>(null);
  const [deletingFile, setDeletingFile] = useState<CategoryFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery<CategoryFilesApiResponse>({
    queryKey: ["category-files", catId],
    queryFn: () => fetchCategoryFiles(catId),
    enabled: !!catId,
  });

  const files = data?.data ?? [];

  // ── Filter ── (يستخدم الحقول الصحيحة من الـ API)
  const filteredFiles = searchQuery.trim()
    ? files.filter(
        (file) =>
          file.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files; // لو الـ search فاضي → اعرض كل الملفات

  const deleteMutation = useMutation({
    mutationFn: (fileId: number) => deleteFile(catId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-files", catId] });
      setDeletingFile(null);
    },
  });

  // ── Error State ──
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 rounded-2xl border border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold">حدث خطأ أثناء التحميل</p>
          <p className="text-red-400 dark:text-red-300/60 text-sm mt-1">{(error as Error).message}</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="p-1 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* ── Back Button ── */}
          <button
            onClick={() => navigate("/dashboard/categories")}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4"
            dir="rtl"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            العودة إلى الفئات
          </button>

          {/* ── Main Content ── */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
            {/* ── Toolbar ── */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200/80 dark:border-slate-700/60">
              {/* Upload Button */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors shadow-md shadow-purple-500/20"
                dir="rtl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>رفع ملف</span>
              </button>

              {/* Search */}
              <div className="w-full sm:w-auto" dir="rtl">
                <div className="relative">
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="بحث عن ملف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="
                      w-full sm:w-64 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400
                      dark:bg-slate-700/50 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500
                      rounded-xl pr-10 pl-4 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
                      transition-all duration-200
                    "
                  />
                </div>
              </div>
            </div>

            {/* ── Stats Bar ── */}
            {!isLoading && (
              <div className="px-4 py-2 flex items-center gap-4 border-b border-slate-100 dark:border-slate-700/40 text-xs text-slate-500 dark:text-slate-400" dir="rtl">
                <span>إجمالي الملفات: <strong className="text-slate-700 dark:text-slate-300">{files.length}</strong></span>
                {data?.meta && (
                  <>
                    <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
                    <span>الصفحة: <strong className="text-slate-700 dark:text-slate-300">{data.meta.current_page}</strong> من <strong className="text-slate-700 dark:text-slate-300">{data.meta.last_page}</strong></span>
                  </>
                )}
              </div>
            )}

            {/* ── Table ── */}
            <FilesTable
              files={filteredFiles}
              isLoading={isLoading}
              onEdit={setEditingFile}
              onDelete={setDeletingFile}
            />
          </div>
        </div>
      </div>

      {/* ── Upload Modal ── */}
      <UploadFileModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        categoryId={catId}
      />

      {/* ── Update Modal ── */}
      <UpdateFileModal
        file={editingFile}
        categoryId={catId}
        onClose={() => setEditingFile(null)}
      />

      {/* ── Delete Confirm Modal ── */}
      <DeleteFileModal
        file={deletingFile}
        onClose={() => setDeletingFile(null)}
        onConfirm={() => deleteMutation.mutate(deletingFile!.id)}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default CategoryFiles;
