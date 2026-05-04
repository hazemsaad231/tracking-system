import React from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSend: () => void;
  isPending: boolean;
  isError: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function MessageInput({
  messageText,
  setMessageText,
  handleKeyDown,
  handleSend,
  isPending,
  isError,
  inputRef,
}: MessageInputProps) {
  return (
    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
      {isError && (
        <p className="text-[10px] text-red-500 mb-1.5 px-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          فشل إرسال الرسالة، حاول مرة أخرى.
        </p>
      )}
      <div className="flex items-end gap-2 relative">
        <textarea
          ref={inputRef as any}
          rows={1}
          placeholder="اكتب رسالة..."
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            // Auto-resize textarea
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 max-h-[100px] min-h-[44px] px-4 py-3 rounded-2xl text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-500 transition-all resize-none leading-relaxed shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={!messageText.trim() || isPending}
          className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none mb-0.5"
          aria-label="إرسال"
        >
          {isPending ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <Send size={18} className="-ml-1" />
          )}
        </button>
      </div>
    </div>
  );
}
