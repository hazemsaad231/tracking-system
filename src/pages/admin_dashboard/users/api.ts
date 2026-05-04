import apiClient from "@/api/axios";
import type { ApiResponse, User, UserDetailResponse, CreateUserPayload, UpdateUserPayload, AssignmentsApiResponse, ClientAssignmentsApiResponse } from "./types";

export const fetchUsers = async (role?: string): Promise<ApiResponse> => {
  const url = role ? `/users?roles[]=${role}&per_page=15` : "/users?per_page=15";
  const { data } = await apiClient.get<ApiResponse>(url);
  return data;
};


export const fetchUserById = async (id: number): Promise<User> => {
  const { data } = await apiClient.get<UserDetailResponse>(`/users/${id}`);
  return data.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await apiClient.post<UserDetailResponse>("/users", payload);
  return data.data;
};

export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<User> => {
  const { data } = await apiClient.put<UserDetailResponse>(`/users/${id}`, payload);
  return data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

// ─── Staff Assignment (Clients) ────────────────────────────────────────────────
export const fetchAssignments = async (clientId: number): Promise<AssignmentsApiResponse> => {
  const { data } = await apiClient.get<AssignmentsApiResponse>(`/users/${clientId}/assignments`);
  return data;
};


export const assignStaff = async (clientId: number, staff_ids: number[]) => {
  const { data } = await apiClient.post(`/users/${clientId}/assign-staff`, { staff_ids });
  return data;
};

export const unassignStaff = async (clientId: number, staff_ids: number[]) => {
  const { data } = await apiClient.post(`/users/${clientId}/unassign-staff`, { staff_ids });
  return data;
};

export const syncStaff = async (clientId: number, staff_ids: number[]) => {
  const { data } = await apiClient.put(`/users/${clientId}/sync-staff`, { staff_ids });
  return data;
};

// ─── Clients assigned to Staff ────────────────────────────────────────────────
export const fetchStaffClients = async (staffId: number): Promise<ClientAssignmentsApiResponse> => {
  const { data } = await apiClient.get<ClientAssignmentsApiResponse>(`/users/${staffId}/clients`);
  return data;
};


