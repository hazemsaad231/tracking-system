import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, deleteCategory } from "./api";
import type { CategoriesApiResponse, Category } from "./types";
import CategoriesTable from "./components/CategoriesTable";
import CreateCategoryModal from "./components/CreateCategoryModal";
import CreateSubCategoryModal from "./components/CreateSubCategoryModal";
import EditCategoryModal from "./components/EditCategoryModal";
import DeleteCategoryModal from "./components/DeleteCategoryModal";

// ─── Page Component ───────────────────────────────────────────────────────────
const Categories = () => {
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [parentForSub, setParentForSub] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery<CategoriesApiResponse>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categories = data?.data ?? [];

  // ── Filter ──
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.children.some((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeletingCategory(null);
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
          {/* ── Main Content ── */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
            {/* ── Toolbar ── */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200/80 dark:border-slate-700/60">
              {/* Add Category Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>إضافة فئة</span>
              </button>

              {/* Search */}
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="بحث عن فئة..."
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
                <span>إجمالي الفئات: <strong className="text-slate-700 dark:text-slate-300">{categories.length}</strong></span>
                <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
                <span>
                  الفئات الفرعية:{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {categories.reduce((acc, cat) => acc + cat.children.length, 0)}
                  </strong>
                </span>
              </div>
            )}

            {/* ── Table ── */}
            <CategoriesTable
              categories={filteredCategories}
              isLoading={isLoading}
              onEdit={setEditingCategory}
              onDelete={setDeletingCategory}
              onAddSub={(parent) => setParentForSub(parent)}
            />
          </div>
        </div>
      </div>

      {/* ── Create Modal (Root) ── */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        parentCategory={null}
      />

      {/* ── Create Sub-Category Modal (مخصص للفئات الفرعية فقط) ── */}
      <CreateSubCategoryModal
        parentCategory={parentForSub}
        onClose={() => setParentForSub(null)}
      />

      {/* ── Edit Modal ── */}
      <EditCategoryModal
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />

      {/* ── Delete Confirm Modal ── */}
      <DeleteCategoryModal
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => deleteMutation.mutate(deletingCategory!.id)}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default Categories;
