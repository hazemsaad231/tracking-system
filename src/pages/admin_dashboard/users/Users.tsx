import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchUserById,
  fetchStaffClients,
  createUser,
  updateUser,
  deleteUser,
  fetchAssignments,
  assignStaff,
  unassignStaff,
} from "./api";
import { fetchRoles } from "../roles/api";
import type {
  ApiResponse,
  User,
  CreateUserPayload,
  UpdateUserPayload,
  AssignmentsApiResponse,
  ClientAssignmentsApiResponse,
} from "./types";
import UsersTable from "./components/UsersTable";
import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import UserDetailPanel from "./components/UserDetailPanel";
import DeleteConfirmModal from "./components/DeleteModal";
import AssignStaffModal from "./components/AssignStaffModal";

// ─── Page Component ───────────────────────────────────────────────────────────
const Users = () => {
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [assigningClient, setAssigningClient] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams] = useSearchParams();
  const roleFilter = searchParams.get("role") || undefined;

  // ── Users List ──
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["users", roleFilter],
    queryFn: () => fetchUsers(roleFilter),
  });

  const users = data?.data || [];
  const meta = data?.meta;

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)
  );

  // ── Roles (shared by Create + Edit modals) ──
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    staleTime: 5 * 60 * 1000,
    enabled: showCreateModal || !!editingUser,
  });
  const roles = rolesData?.data ?? [];

  // ── User Detail (slide-over panel) ──
  const { data: selectedUser, isLoading: detailLoading } = useQuery<User>({
    queryKey: ["user", selectedUserId],
    queryFn: () => fetchUserById(selectedUserId!),
    enabled: selectedUserId !== null,
  });

  const isSelectedClient =
    selectedUser?.roles?.some((r) => r.toLowerCase().includes("client")) ||
    selectedUser?.role?.toLowerCase().includes("client") ||
    false;

  const { data: staffClientsData, isLoading: staffClientsLoading } =
    useQuery<ClientAssignmentsApiResponse>({
      queryKey: ["staffClients", selectedUserId],
      queryFn: () => fetchStaffClients(selectedUserId!),
      enabled: selectedUserId !== null && !!selectedUser && !isSelectedClient,
    });
  const assignedClients = staffClientsData?.data?.assigned_clients ?? [];

  // ── Assignments (AssignStaffModal) ──
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useQuery<AssignmentsApiResponse>({
      queryKey: ["assignments", assigningClient?.id],
      queryFn: () => fetchAssignments(assigningClient!.id),
      enabled: !!assigningClient,
    });
  const assignedStaff = assignmentsData?.data?.assigned_staff ?? [];

  const { data: allUsersData, isLoading: allUsersLoading } = useQuery<ApiResponse>({
    queryKey: ["all-users"],
    queryFn: () => fetchUsers(),
    enabled: !!assigningClient,
    staleTime: 60_000,
  });
  const allUsers = allUsersData?.data ?? [];

  // ── Mutations ──
  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", vars.id] });
      setEditingUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeletingUser(null);
    },
  });

  const assignMutation = useMutation({
    mutationFn: (ids: number[]) => assignStaff(assigningClient!.id, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", assigningClient?.id] });
    },
  });

  const unassignMutation = useMutation({
    mutationFn: (staffId: number) => unassignStaff(assigningClient!.id, [staffId]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", assigningClient?.id] });
    },
  });

  // ── Close Handlers (also reset mutation state) ──
  const closeCreateModal = () => {
    setShowCreateModal(false);
    createMutation.reset();
  };

  const closeEditModal = () => {
    setEditingUser(null);
    updateMutation.reset();
  };

  const closeAssignModal = () => {
    setAssigningClient(null);
    assignMutation.reset();
    unassignMutation.reset();
  };

  // ── Error State ──
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
      <div className="p-1 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* ── Main Content ── */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-700/60">
            {/* ── Toolbar ── */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200/80 dark:border-slate-700/60">

              {/* Add User Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>إضافة مستخدم</span>
              </button>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Search */}
                <div className="relative w-full sm:w-auto">
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="بحث عن مستخدم..."
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

            {/* ── Table ── */}
            <UsersTable
              users={filteredUsers}
              meta={meta}
              isLoading={isLoading}
              onView={setSelectedUserId}
              onEdit={setEditingUser}
              onDelete={setDeletingUser}
              onAssign={setAssigningClient}
            />

          </div>
        </div>
      </div>

      {/* ── Detail Slide-Over ── */}
      <UserDetailPanel
        userId={selectedUserId}
        user={selectedUser}
        isLoading={detailLoading}
        assignedClients={assignedClients}
        clientsLoading={staffClientsLoading}
        onClose={() => setSelectedUserId(null)}
      />

      {/* ── Create Modal ── */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        roles={roles}
        rolesLoading={rolesLoading}
        onSubmit={(payload) => createMutation.mutate(payload)}
        isPending={createMutation.isPending}
        apiError={createMutation.error}
      />

      {/* ── Edit Modal ── */}
      <EditUserModal
        user={editingUser}
        onClose={closeEditModal}
        roles={roles}
        rolesLoading={rolesLoading}
        onSubmit={(payload) =>
          editingUser && updateMutation.mutate({ id: editingUser.id, payload })
        }
        isPending={updateMutation.isPending}
        apiError={updateMutation.error}
      />

      {/* ── Delete Confirm Modal ── */}
      <DeleteConfirmModal
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => deleteMutation.mutate(deletingUser!.id)}
        isPending={deleteMutation.isPending}
      />

      {/* ── Assign Staff Modal ── */}
      <AssignStaffModal
        client={assigningClient}
        onClose={closeAssignModal}
        assignedStaff={assignedStaff}
        assignmentsLoading={assignmentsLoading}
        allUsers={allUsers}
        usersLoading={allUsersLoading}
        onAssign={(ids) => assignMutation.mutate(ids)}
        onUnassign={(id) => unassignMutation.mutate(id)}
        assignPending={assignMutation.isPending}
        assignSuccess={assignMutation.isSuccess}
        unassignPendingId={
          unassignMutation.isPending ? (unassignMutation.variables ?? null) : null
        }
        error={assignMutation.error ?? unassignMutation.error}
      />

    </>
  );
};

export default Users;
