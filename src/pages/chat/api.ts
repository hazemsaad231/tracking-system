import apiClient from "@/api/axios";
import type {
  ContactsApiResponse,
  ConversationsApiResponse,
  MessagesApiResponse,
  SingleConversationApiResponse,
  UnreadCountApiResponse,
  SendMessagePayload,
  StartConversationPayload,
  AdminConversationsApiResponse,
  AdminSingleConversationApiResponse,
  AdminMessagesApiResponse,
  AdminConversationsParams,
} from "./types";

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const fetchChatContacts = async (): Promise<ContactsApiResponse> => {
  const { data } = await apiClient.get<ContactsApiResponse>("/chat/contacts");
  return data;
};

// ─── Conversations ────────────────────────────────────────────────────────────
export const fetchConversations = async (): Promise<ConversationsApiResponse> => {
  const { data } = await apiClient.get<ConversationsApiResponse>("/chat/conversations");
  return data;
};

export const fetchConversationById = async (id: number): Promise<SingleConversationApiResponse> => {
  const { data } = await apiClient.get<SingleConversationApiResponse>(`/chat/conversations/${id}`);
  return data;
};

export const startConversation = async (payload: StartConversationPayload): Promise<SingleConversationApiResponse> => {
  const { data } = await apiClient.post<SingleConversationApiResponse>("/chat/conversations", payload);
  return data;
};

// ─── Messages ─────────────────────────────────────────────────────────────────
export const fetchMessages = async (conversationId: number, cursor?: string): Promise<MessagesApiResponse> => {
  const params = cursor ? { cursor } : {};
  const { data } = await apiClient.get<MessagesApiResponse>(
    `/chat/conversations/${conversationId}/messages`,
    { params }
  );
  return data;
};

export const sendMessage = async (conversationId: number, payload: SendMessagePayload): Promise<void> => {
  await apiClient.post(`/chat/conversations/${conversationId}/messages`, payload);
};

export const markConversationRead = async (conversationId: number): Promise<void> => {
  await apiClient.post(`/chat/conversations/${conversationId}/read`);
};

// ─── Unread Count ─────────────────────────────────────────────────────────────
export const fetchChatUnreadCount = async (): Promise<UnreadCountApiResponse> => {
  const { data } = await apiClient.get<UnreadCountApiResponse>("/chat/unread-count");
  return data;
};

// ─── Admin Oversight ──────────────────────────────────────────────────────────
export const fetchAdminConversations = async (
  params: AdminConversationsParams = {}
): Promise<AdminConversationsApiResponse> => {
  const query: Record<string, any> = {};
  if (params.search) query.search = params.search;
  if (params.user_id) query.user_id = params.user_id;
  if (params.page) query.page = params.page;
  if (params.between && params.between.length === 2) {
    query["between[]"] = params.between;
  }
  const { data } = await apiClient.get<AdminConversationsApiResponse>(
    "/admin/chat/conversations",
    { params: query }
  );
  return data;
};

export const fetchAdminConversationById = async (
  id: number
): Promise<AdminSingleConversationApiResponse> => {
  const { data } = await apiClient.get<AdminSingleConversationApiResponse>(
    `/admin/chat/conversations/${id}`
  );
  return data;
};

export const fetchAdminConversationMessages = async (
  conversationId: number,
  cursor?: string
): Promise<AdminMessagesApiResponse> => {
  const params = cursor ? { cursor } : {};
  const { data } = await apiClient.get<AdminMessagesApiResponse>(
    `/admin/chat/conversations/${conversationId}/messages`,
    { params }
  );
  return data;
};
