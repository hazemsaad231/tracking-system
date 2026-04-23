import apiClient from "@/api/axios";
import type { RolesApiResponse, RoleDetailResponse, Role, CreateRolePayload, UpdateRolePayload } from "./types";

export const fetchRoles = async (): Promise<RolesApiResponse> => {
  const { data } = await apiClient.get<RolesApiResponse>("/roles");
  return data;
};

export const fetchRoleById = async (id: number): Promise<Role> => {
  const { data } = await apiClient.get<RoleDetailResponse>(`/roles/${id}`);
  return data.data;
};

export const createRole = async (payload: CreateRolePayload): Promise<Role> => {
  const { data } = await apiClient.post<RoleDetailResponse>("/roles", payload);
  return data.data;
};

export const updateRole = async (id: number, payload: UpdateRolePayload): Promise<Role> => {
  const { data } = await apiClient.put<RoleDetailResponse>(`/roles/${id}`, payload);
  return data.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await apiClient.delete(`/roles/${id}`);
};
