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
