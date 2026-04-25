import apiClient from "@/api/axios";


import type { ApiResponse, User, UserDetailResponse, CreateUserPayload, UpdateUserPayload } from "./types";

export const fetchUsers = async (): Promise<ApiResponse> => {
  const { data } = await apiClient.get("/users?per_page=15");
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
