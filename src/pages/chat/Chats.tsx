import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, X } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markConversationRead,
  fetchChatContacts,
  startConversation,
  fetchChatUnreadCount,
} from "./api";
import type { Conversation, Message, Contact } from "./types";

// Extracted Components
import ChatHeader from "./components/ChatHeader";
import ConversationList from "./components/ConversationList";
import MessagesView from "./components/MessagesView";
import MessageInput from "./components/MessageInput";
import NewConversation from "./components/NewConversation";

type View = "list" | "messages" | "new";

export default function ChatWidget() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("list");
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");
  const [contactSearch, setContactSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Unread count ──
  const { data: unreadData } = useQuery({
    queryKey: ["chat-unread-count"],
    queryFn: fetchChatUnreadCount,
    refetchInterval: 30_000,
    enabled: !!user,
  });
  const unreadCount = unreadData?.unread_count ?? 0;

  // ── Conversations list ──
  const { data: conversationsData, isLoading: convLoading } = useQuery({
    queryKey: ["chat-conversations"],
    queryFn: fetchConversations,
    enabled: isOpen && view === "list",
    refetchInterval: isOpen ? 15_000 : false,
  });
  const conversations = conversationsData?.data ?? [];

  // ── Messages inside active conversation ──
  const { data: messagesData, isLoading: msgsLoading } = useQuery({
    queryKey: ["chat-messages", activeConversation?.id],
    queryFn: () => fetchMessages(activeConversation!.id),
    enabled: !!activeConversation && view === "messages",
    refetchInterval: view === "messages" ? 5_000 : false,
  });
  const messages: Message[] = [...(messagesData?.data ?? [])].reverse();

  // ── Contacts ──
  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ["chat-contacts"],
    queryFn: fetchChatContacts,
    enabled: isOpen && view === "new",
    staleTime: 60_000,
  });
  const contacts: Contact[] = (contactsData?.data ?? []).filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  // ── Effects ──
  useEffect(() => {
    if (activeConversation && view === "messages") {
      markConversationRead(activeConversation.id).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["chat-unread-count"] });
    }
  }, [activeConversation, view, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (view === "messages") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [view]);

  // ── Mutations ──
  const sendMutation = useMutation({
    mutationFn: () => sendMessage(activeConversation!.id, { body: messageText.trim() }),
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["chat-messages", activeConversation?.id] });
      queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
    },
  });

  const startMutation = useMutation({
    mutationFn: (userId: number) => startConversation({ user_id: userId }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
      setActiveConversation(res.data);
      setView("messages");
    },
  });

  // ── Handlers ──
  const handleSend = () => {
    if (!messageText.trim() || sendMutation.isPending) return;
    sendMutation.mutate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setView("messages");
  };

  const goBack = () => {
    setView("list");
    setActiveConversation(null);
    setContactSearch("");
  };

  if (!user) return null;

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl shadow-purple-500/30 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="فتح المحادثات"
      >
        {isOpen ? (
          <X size={22} className="transition-transform duration-300" />
        ) : (
          <MessageCircle size={22} className="transition-transform duration-300" />
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div
        className={`
          fixed bottom-24 left-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl shadow-black/20
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10
          flex flex-col overflow-hidden
          transition-all duration-300 origin-bottom-left
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}
        `}
        style={{ maxHeight: "520px" }}
      >
        <ChatHeader
          view={view}
          activeConversation={activeConversation}
          goBack={goBack}
          setView={setView}
        />

        <div className="flex-1 overflow-y-auto min-h-0">
          {view === "list" && (
            <ConversationList
              conversations={conversations}
              convLoading={convLoading}
              openConversation={openConversation}
              setView={setView}
            />
          )}

          {view === "messages" && (
            <MessagesView
              messages={messages}
              msgsLoading={msgsLoading}
              messagesEndRef={messagesEndRef}
            />
          )}

          {view === "new" && (
            <NewConversation
              contactSearch={contactSearch}
              setContactSearch={setContactSearch}
              contacts={contacts}
              contactsLoading={contactsLoading}
              startMutationPending={startMutation.isPending}
              onStartConversation={(id) => startMutation.mutate(id)}
            />
          )}
        </div>

        {view === "messages" && (
          <MessageInput
            messageText={messageText}
            setMessageText={setMessageText}
            handleKeyDown={handleKeyDown}
            handleSend={handleSend}
            isPending={sendMutation.isPending}
            isError={sendMutation.isError}
            inputRef={inputRef}
          />
        )}
      </div>
    </>
  );
}