// ─── Chat Types ────────────────────────────────────────────────────────────────

export interface Contact {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface ContactsApiResponse {
  data: Contact[];
}

export interface Message {
  id: number;
  conversation_id: number;
  is_mine: boolean;
  sender: Contact;
  body: string;
  created_at: string;
  read_at: string | null;
}

export interface MessagesApiResponse {
  data: Message[];
  next_cursor?: string | null;
}

export interface Conversation {
  id: number;
  other_party: Contact;
  last_message: Message | null;
  unread_count: number;
  created_at: string;
}

export interface ConversationsApiResponse {
  data: Conversation[];
}

export interface SingleConversationApiResponse {
  data: Conversation;
}

export interface UnreadCountApiResponse {
  unread_count: number;
}

export interface SendMessagePayload {
  body: string;
}

export interface StartConversationPayload {
  user_id: number;
}

// ─── Admin Oversight Types ────────────────────────────────────────────────────

export interface AdminConversation {
  id: number;
  participants?: Contact[];
  other_party?: Contact;
  last_message: Message | null;
  unread_count?: number;
  created_at: string;
}

export interface PaginationMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationMetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface AdminConversationsApiResponse {
  data: AdminConversation[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface AdminSingleConversationApiResponse {
  data: AdminConversation;
}

export interface AdminMessagesApiResponse {
  data: Message[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
  next_cursor?: string | null;
}

export interface AdminConversationsParams {
  search?: string;
  user_id?: number;
  between?: [number, number];
  page?: number;
}
