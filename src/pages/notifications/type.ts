export interface AppNotification {
  id: string; // Laravel UUID
  type: string;
  notifiable_type: string;
  notifiable_id: number;
    title?: string;
    message: string;
    [key: string]: any;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationsApiResponse {
  success: boolean;
  message?: string;
  data: AppNotification[];
}

export interface UnreadCountResponse {
  success: boolean;
  message?: string;
  unread_count: number;
}
