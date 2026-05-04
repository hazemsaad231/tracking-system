import { MessageCircle } from "lucide-react";
import type { Conversation } from "../types";
import { formatTime } from "../utils";

interface ConversationListProps {
  conversations: Conversation[];
  convLoading: boolean;
  openConversation: (conv: Conversation) => void;
  setView: (view: "new") => void;
}

export default function ConversationList({
  conversations,
  convLoading,
  openConversation,
  setView,
}: ConversationListProps) {
  if (convLoading) {
    return (
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-slate-100 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-2 w-40 bg-slate-100 dark:bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400 dark:text-slate-500">
        <MessageCircle size={36} className="opacity-30" />
        <p className="text-sm">لا توجد محادثات بعد</p>
        <button
          onClick={() => setView("new")}
          className="text-purple-600 dark:text-purple-400 text-xs font-medium hover:underline"
        >
          ابدأ محادثة جديدة
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-white/5">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => openConversation(conv)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors text-right"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {conv.other_party.name.charAt(0).toUpperCase()}
            </div>
            {conv.unread_count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 text-[9px] text-white font-bold flex items-center justify-center">
                {conv.unread_count}
              </span>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center justify-between gap-2">
              <p
                className={`text-sm truncate ${
                  conv.unread_count > 0
                    ? "font-semibold text-slate-900 dark:text-white"
                    : "font-medium text-slate-700 dark:text-slate-200"
                }`}
              >
                {conv.other_party.name}
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
      ))}
    </div>
  );
}
