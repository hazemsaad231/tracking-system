import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoles, deleteRole } from "./api";
import type { RolesApiResponse, Role } from "./types";
import RolesTable from "./components/RolesTable";
import CreateRoleModal from "./components/CreateRoleModal";
import EditRoleModal from "./components/EditRoleModal";
import DeleteConfirmModal from "./components/DeleteModel";


// ─── Page Component ───────────────────────────────────────────────────────────
const Roles = () => {
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const { data, isLoading, error } = useQuery<RolesApiResponse>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const roles = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setDeletingRole(null);
    },
  });

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 rounded-2xl border border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
            حدث خطأ أثناء التحميل
          </p>
          <p className="text-red-400 dark:text-red-300/60 text-sm mt-1">
            {(error as Error).message}
          </p>
        </div>
      </div>
    );

  return (
    <>
      <div className="p-1 sm:p-4 lg:p-8 ">
        <div className="max-w-7xl mx-auto">
          {/* ── Main Content ── */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/60">
            {/* ── Toolbar ── */}
            <div className="p-4 flex justify-start items-center gap-4 border-b border-slate-200/80 dark:border-slate-700/60">
              {/* Add Role Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>إضافة دور</span>
              </button>
            </div>

            {/* ── Table ── */}
            <RolesTable
              roles={roles}
              isLoading={isLoading}
              onEdit={setEditingRole}
              onDelete={setDeletingRole}
            />
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <CreateRoleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditRoleModal
        role={editingRole}
        onClose={() => setEditingRole(null)}
      />

      <DeleteConfirmModal
        role={deletingRole}
        onClose={() => setDeletingRole(null)}
        onConfirm={() => deleteMutation.mutate(deletingRole!.id)}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default Roles;