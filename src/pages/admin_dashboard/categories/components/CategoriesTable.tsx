import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "../types";
import SkeletonRow from "./SkeletonRow";
import SkeletonCard from "./SkeletonCard";

const COLUMNS = ["#", "الاسم", "الوصف", "الفئات الفرعية", "تاريخ الإنشاء", "إجراءات"];

// ─── Props ─────────────────────────────────────────────────────────────────
interface Props {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddSub: (parent: Category) => void;
}

// ─── Action Buttons ─────────────────────────────────────────────────────────
const ActionButtons = ({
  onViewFiles,
  onAddSub,
  onEdit,
  onDelete,
}: {
  onViewFiles?: () => void;
  onAddSub?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex items-center justify-center gap-1">
    {onViewFiles && (
      <button
        onClick={onViewFiles}
        title="ملفات الفئة"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-500/10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </button>
    )}
    {onAddSub && (
      <button
        onClick={onAddSub}
        title="إضافة فئة فرعية"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    )}
    <button
      onClick={onEdit}
      title="تعديل"
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-500/10 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
    <button
      onClick={onDelete}
      title="حذف"
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
);

// ─── Component ─────────────────────────────────────────────────────────────
export default function CategoriesTable({ categories, isLoading, onEdit, onDelete, onAddSub }: Props) {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <>
        {/* Mobile Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        {/* Desktop Skeleton */}
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
  if (categories.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400">
        <svg className="mx-auto w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="mt-2 text-lg font-semibold">لا توجد فئات</h3>
        <p className="text-sm text-slate-400">ابدأ بإضافة فئة جديدة لعرضها هنا.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden" dir="rtl">
      {/* ── Mobile View - Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col overflow-hidden">
            {/* Card Header */}
            <div className="flex justify-between items-start p-4">
              <div>
                <span className="font-semibold text-slate-800 dark:text-white">{cat.name}</span>
                <span className="mr-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                  رئيسية
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(cat.created_at).toLocaleDateString("ar-EG")}
              </span>
            </div>

            {/* Description */}
            {cat.description && (
              <p className="px-4 pb-2 text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
            )}

            {/* Sub-categories count */}
            {cat.children.length > 0 && (
              <div className="px-4 pb-3">
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <svg className={`w-3.5 h-3.5 transition-transform ${expandedIds.has(cat.id) ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {cat.children.length} فئة فرعية
                </button>
                {expandedIds.has(cat.id) && (
                  <ul className="mt-2 space-y-1.5">
                    {cat.children.map((child) => (
                      <li
                        key={child.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white dark:bg-slate-700/40 border border-slate-200/60 dark:border-white/5 px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3 h-px bg-slate-300 dark:bg-slate-600 shrink-0" />
                          <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{child.name}</span>
                          <span className="text-[9px] font-medium px-1 py-0.5 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-600 dark:text-slate-400 shrink-0">فرعية</span>
                        </div>
                        {/* أزرار التعديل والحذف للفئات الفرعية */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => onEdit({ ...child, parent: cat, children: [] } as any)}
                            title="تعديل"
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-500/10 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onDelete({ ...child, parent: cat, children: [] } as any)}
                            title="حذف"
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Card Footer */}
            <div className="flex items-center justify-end gap-1 px-4 py-3 border-t border-slate-200/80 dark:border-slate-700/60 mt-auto">
              <ActionButtons
                onViewFiles={() => navigate(`/dashboard/categories/${cat.id}/files`)}
                onAddSub={() => onAddSub(cat)}
                onEdit={() => onEdit(cat)}
                onDelete={() => onDelete(cat)}
              />
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
            {categories.map((cat, index) => (
              <>
                {/* ── Root Row ── */}
                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-150">
                  {/* # */}
                  <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-500 text-center">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {cat.children.length > 0 && (
                        <button
                          onClick={() => toggleExpand(cat.id)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedIds.has(cat.id) ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                      <span className="font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                        رئيسية
                      </span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-center">
                    {cat.description || <span className="text-slate-300 dark:text-slate-600 italic">—</span>}
                  </td>

                  {/* Children count */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {cat.children.length}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 text-center font-mono">
                    {new Date(cat.created_at).toLocaleDateString("ar-EG")}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <ActionButtons
                      onViewFiles={() => navigate(`/dashboard/categories/${cat.id}/files`)}
                      onAddSub={() => onAddSub(cat)}
                      onEdit={() => onEdit(cat)}
                      onDelete={() => onDelete(cat)}
                    />
                  </td>
                </tr>

                {/* ── Children Rows ── */}
                {expandedIds.has(cat.id) &&
                  cat.children.map((child) => (
                    <tr key={`child-${child.id}`} className="bg-slate-50/60 dark:bg-white/[0.02] hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors duration-150">
                      {/* # */}
                      <td className="px-6 py-3 text-center">
                        <div className="flex justify-center">
                          <div className="w-3 h-px bg-slate-300 dark:bg-slate-600" />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-slate-600 dark:text-slate-300">{child.name}</span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                            فرعية
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-3 text-slate-400 dark:text-slate-500 text-center text-xs">
                        {child.description || <span className="italic">—</span>}
                      </td>

                      {/* Children count (N/A for sub) */}
                      <td className="px-6 py-3 text-center">
                        <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-3 text-xs text-slate-400 dark:text-slate-500 text-center font-mono">
                        {new Date(child.created_at).toLocaleDateString("ar-EG")}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3">
                        <ActionButtons
                          onEdit={() => onEdit({ ...child, parent: cat, children: [] } as any)}
                          onDelete={() => onDelete({ ...child, parent: cat, children: [] } as any)}
                        />
                      </td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
