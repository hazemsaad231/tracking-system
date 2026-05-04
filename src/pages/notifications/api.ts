import apiClient from "@/api/axios";
import type { NotificationsApiResponse, UnreadCountResponse } from "./type";

export const fetchNotifications = async (): Promise<NotificationsApiResponse> => {
  const { data } = await apiClient.get<NotificationsApiResponse>("/notifications");
  return data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const { data } = await apiClient.get<UnreadCountResponse>("/notifications/unread-count");
  return data;
};

export const markAsRead = async (id: string): Promise<any> => {
  const { data } = await apiClient.post<any>(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async (): Promise<any> => {
  const { data } = await apiClient.post<any>("/notifications/read-all");
  return data;
};

export const deleteNotification = async (id: string): Promise<void> => {
  await apiClient.delete(`/notifications/${id}`);
};
