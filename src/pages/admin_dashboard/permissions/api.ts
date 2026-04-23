import apiClient from "@/api/axios";
import type { PermissionsApiResponse, PermissionDetailResponse, Permission, CreatePermissionPayload } from "./types";

export const fetchPermissions = async (): Promise<PermissionsApiResponse> => {
  const { data } = await apiClient.get<PermissionsApiResponse>("/permissions");
  return data;
};

export const createPermission = async (payload: CreatePermissionPayload): Promise<Permission> => {
  const { data } = await apiClient.post<PermissionDetailResponse>("/permissions", payload);
  return data.data;
};

export const deletePermission = async (id: number): Promise<void> => {
  await apiClient.delete(`/permissions/${id}`);
};
