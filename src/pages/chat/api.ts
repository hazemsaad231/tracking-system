import apiClient from "@/api/axios";
import type {
  ContactsApiResponse,
  ConversationsApiResponse,
  MessagesApiResponse,
  SingleConversationApiResponse,
  UnreadCountApiResponse,
  SendMessagePayload,
  StartConversationPayload,
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
