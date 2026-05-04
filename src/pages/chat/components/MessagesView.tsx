import { MessageCircle } from "lucide-react";
import type { Message } from "../types";
import { formatTime, formatDate } from "../utils";

interface MessagesViewProps {
  messages: Message[];
  msgsLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessagesView({
  messages,
  msgsLoading,
  messagesEndRef,
}: MessagesViewProps) {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto" style={{ minHeight: "280px" }}>
      {msgsLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-6 h-6 animate-spin text-purple-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 py-8">
          <MessageCircle size={32} className="opacity-20 mb-2" />
          <p className="text-sm font-medium">ابدأ المحادثة الآن</p>
          <p className="text-xs opacity-70">أرسل رسالة للبدء بالتواصل</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMine = msg.is_mine;

          // Date Separator Logic
          const msgDate = new Date(msg.created_at).toDateString();
          const prevMsgDate = index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null;
          const showDate = msgDate !== prevMsgDate;

          return (
            <div key={msg.id} className="flex flex-col gap-2">
              {showDate && (
                <div className="flex justify-center my-2">
                  <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
              )}

              <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`} dir="rtl">
                <div className={`flex flex-col max-w-[80%] ${isMine ? "items-end" : "items-start"}`}>
                  <div
                    className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isMine
                        ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                  </div>

                  {/* Time and Status indicator */}
                  <div
                    className={`flex items-center gap-1 mt-1 px-1 ${
                      isMine ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                      {formatTime(msg.created_at)}
                    </span>
                    {/* Read receipt icon for my messages */}
                    {isMine &&
                      (msg.read_at ? (
                        <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
}
