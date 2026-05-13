import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  X,
  Search,
  ShieldCheck,
  Users as UsersIcon,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Eye,
} from "lucide-react";

const SELECT_CLASS =
  "w-full appearance-none py-2 pr-3 pl-9 rounded-lg text-sm " +
  "bg-slate-50 dark:bg-slate-800/80 " +
  "border border-slate-200 dark:border-slate-700 " +
  "text-slate-800 dark:text-slate-100 " +
  "focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 " +
  "focus:ring-2 focus:ring-violet-500/20 " +
  "transition-colors cursor-pointer";

const OPTION_CLASS = "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100";

function SelectField({
  value,
  onChange,
  children,
}: {
  value: number | "";
  onChange: (val: number | "") => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        className={SELECT_CLASS}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
}
import {
  fetchAdminConversations,
  fetchAdminConversationById,
  fetchAdminConversationMessages,
  fetchChatContacts,
} from "../api";
import type { AdminConversation, Contact, Message } from "../types";
import { formatTime, formatDate } from "../utils";

interface AdminChatOversightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterMode = "all" | "search" | "user" | "between";

export default function AdminChatOversightModal({
  isOpen,
  onClose,
}: AdminChatOversightModalProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<number | "">("");
  const [betweenA, setBetweenA] = useState<number | "">("");
  const [betweenB, setBetweenB] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminConversation | null>(null);

  const queryParams = useMemo(() => {
    const p: {
      search?: string;
      user_id?: number;
      between?: [number, number];
      page?: number;
    } = { page };
    if (filterMode === "search" && search.trim()) p.search = search.trim();
    if (filterMode === "user" && typeof userId === "number") p.user_id = userId;
    if (
      filterMode === "between" &&
      typeof betweenA === "number" &&
      typeof betweenB === "number"
    ) {
      p.between = [betweenA, betweenB];
    }
    return p;
  }, [filterMode, search, userId, betweenA, betweenB, page]);

  const {
    data: convData,
    isLoading: convLoading,
    isFetching: convFetching,
    isError: convError,
  } = useQuery({
    queryKey: ["admin-chat-conversations", queryParams],
    queryFn: () => fetchAdminConversations(queryParams),
    enabled: isOpen,
  });

  const conversations = convData?.data ?? [];
  const meta = convData?.meta;

  const { data: contactsData } = useQuery({
    queryKey: ["chat-contacts"],
    queryFn: fetchChatContacts,
    enabled: isOpen && (filterMode === "user" || filterMode === "between"),
    staleTime: 60_000,
  });
  const contacts: Contact[] = contactsData?.data ?? [];

  const { data: convDetailData } = useQuery({
    queryKey: ["admin-chat-conversation", selected?.id],
    queryFn: () => fetchAdminConversationById(selected!.id),
    enabled: isOpen && !!selected,
  });
  const selectedDetail: AdminConversation | null =
    convDetailData?.data ?? selected;

  const {
    data: messagesData,
    isLoading: msgsLoading,
    isError: msgsError,
  } = useQuery({
    queryKey: ["admin-chat-messages", selected?.id],
    queryFn: () => fetchAdminConversationMessages(selected!.id),
    enabled: isOpen && !!selected,
  });
  const messages: Message[] = [...(messagesData?.data ?? [])].reverse();

  const resetFilters = () => {
    setSearch("");
    setUserId("");
    setBetweenA("");
    setBetweenB("");
    setPage(1);
  };

  const applyFilterMode = (mode: FilterMode) => {
    setFilterMode(mode);
    resetFilters();
  };

  const getParticipants = (conv: AdminConversation): Contact[] => {
    if (conv.participants && conv.participants.length) return conv.participants;
    if (conv.other_party) return [conv.other_party];
    return [];
  };

  const conversationTitle = (conv: AdminConversation) => {
    const parts = getParticipants(conv);
    if (!parts.length) return `محادثة #${conv.id}`;
    return parts.map((p) => p.name).join("  ↔  ");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
            <ShieldCheck size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">إشراف المحادثات</p>
            <p className="text-white/70 text-xs">
              عرض كل محادثات النظام (للمسؤول فقط)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 shrink-0 overflow-x-auto">
          <Filter size={14} className="text-slate-400 mx-1 shrink-0" />
          {(
            [
              { key: "all", label: "الكل" },
              { key: "search", label: "بحث بالاسم/الإيميل" },
              { key: "user", label: "مستخدم محدد" },
              { key: "between", label: "بين مستخدمين" },
            ] as { key: FilterMode; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => applyFilterMode(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterMode === tab.key
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter inputs */}
        {filterMode !== "all" && (
          <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shrink-0">
            {filterMode === "search" && (
              <div className="relative">
                <Search
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الإيميل..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pr-9 pl-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
                />
              </div>
            )}

            {filterMode === "user" && (
              <div className="flex items-center gap-2">
                <UsersIcon size={14} className="text-slate-400 shrink-0" />
                <SelectField
                  value={userId}
                  onChange={(val) => {
                    setUserId(val);
                    setPage(1);
                  }}
                >
                  <option value="" className={OPTION_CLASS}>
                    اختر مستخدمًا...
                  </option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id} className={OPTION_CLASS}>
                      {c.name} — {c.email}
                    </option>
                  ))}
                </SelectField>
              </div>
            )}

            {filterMode === "between" && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <SelectField
                  value={betweenA}
                  onChange={(val) => {
                    setBetweenA(val);
                    setPage(1);
                  }}
                >
                  <option value="" className={OPTION_CLASS}>
                    المستخدم الأول...
                  </option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id} className={OPTION_CLASS}>
                      {c.name} — {c.email}
                    </option>
                  ))}
                </SelectField>
                <span className="text-slate-400 dark:text-slate-500 text-xs text-center">
                  ↔
                </span>
                <SelectField
                  value={betweenB}
                  onChange={(val) => {
                    setBetweenB(val);
                    setPage(1);
                  }}
                >
                  <option value="" className={OPTION_CLASS}>
                    المستخدم الثاني...
                  </option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id} className={OPTION_CLASS}>
                      {c.name} — {c.email}
                    </option>
                  ))}
                </SelectField>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 flex min-h-0">
          {/* Conversations list */}
          <div className="w-full md:w-2/5 lg:w-1/3 border-l border-slate-200 dark:border-white/10 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              {convLoading ? (
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 bg-slate-100 dark:bg-white/10 rounded animate-pulse" />
                        <div className="h-2 w-48 bg-slate-100 dark:bg-white/10 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : convError ? (
                <div className="p-8 text-center text-sm text-red-500">
                  تعذّر تحميل المحادثات.
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <MessageCircle size={36} className="opacity-30" />
                  <p className="text-sm">لا توجد محادثات مطابقة</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {conversations.map((conv) => {
                    const parts = getParticipants(conv);
                    const initials = parts[0]?.name?.charAt(0).toUpperCase() ?? "?";
                    const isActive = selected?.id === conv.id;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelected(conv)}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-right ${
                          isActive
                            ? "bg-violet-50 dark:bg-violet-500/10"
                            : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {conversationTitle(conv)}
                            </p>
                            {conv.last_message && (
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {formatTime(conv.last_message.created_at)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                            {conv.last_message?.body ?? "لا توجد رسائل"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 shrink-0">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.current_page <= 1 || convFetching}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  صفحة {meta.current_page} من {meta.last_page} ({meta.total})
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={meta.current_page >= meta.last_page || convFetching}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Messages viewer */}
          <div className="hidden md:flex flex-1 flex-col min-h-0 bg-slate-50/40 dark:bg-slate-950/40">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
                <Eye size={40} className="opacity-30" />
                <p className="text-sm">اختر محادثة لعرض رسائلها</p>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shrink-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {conversationTitle(selectedDetail ?? selected)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    محادثة #{selected.id} • {formatDate(selected.created_at)}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {msgsLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 animate-spin text-violet-500"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                    </div>
                  ) : msgsError ? (
                    <div className="text-center text-sm text-red-500 py-8">
                      تعذّر تحميل الرسائل.
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 py-8">
                      <MessageCircle size={32} className="opacity-20 mb-2" />
                      <p className="text-sm">لا توجد رسائل في هذه المحادثة</p>
                    </div>
                  ) : (
                    (() => {
                      const parts = getParticipants(selectedDetail ?? selected);
                      const sideMap = new Map<number, "right" | "left">();
                      if (parts[0]?.id) sideMap.set(parts[0].id, "right");
                      if (parts[1]?.id) sideMap.set(parts[1].id, "left");
                      for (const m of messages) {
                        const sid = m.sender?.id;
                        if (sid != null && !sideMap.has(sid)) {
                          sideMap.set(sid, sideMap.size === 0 ? "right" : "left");
                        }
                      }

                      return messages.map((msg, index) => {
                        const msgDate = new Date(msg.created_at).toDateString();
                        const prevDate =
                          index > 0
                            ? new Date(messages[index - 1].created_at).toDateString()
                            : null;
                        const showDate = msgDate !== prevDate;

                        const side = (msg.sender?.id != null && sideMap.get(msg.sender.id)) || "right";
                        const onRight = side === "right";

                        return (
                          <div key={msg.id} className="flex flex-col gap-1">
                            {showDate && (
                              <div className="flex justify-center my-2">
                                <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                                  {formatDate(msg.created_at)}
                                </span>
                              </div>
                            )}
                            <div
                              className={`flex w-full ${onRight ? "justify-end" : "justify-start"}`}
                              dir="ltr"
                            >
                              <div
                                className={`flex flex-col max-w-[75%] ${onRight ? "items-end" : "items-start"}`}
                              >
                                <span className="text-[10px] text-slate-400 mb-1 px-1">
                                  {msg.sender?.name ?? "—"}
                                </span>
                                <div
                                  className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                    onRight
                                      ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-tr-sm"
                                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm"
                                  }`}
                                  dir="rtl"
                                >
                                  <p className="whitespace-pre-wrap break-words">
                                    {msg.body}
                                  </p>
                                </div>
                                <span className="text-[9px] font-medium text-slate-400 mt-1 px-1">
                                  {formatTime(msg.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
