import { Search } from "lucide-react";
import type { Contact } from "../types";

interface NewConversationProps {
  contactSearch: string;
  setContactSearch: (val: string) => void;
  contacts: Contact[];
  contactsLoading: boolean;
  startMutationPending: boolean;
  onStartConversation: (id: number) => void;
}

export default function NewConversation({
  contactSearch,
  setContactSearch,
  contacts,
  contactsLoading,
  startMutationPending,
  onStartConversation,
}: NewConversationProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-slate-100 dark:border-white/10 shrink-0">
        <div className="relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن مستخدم..."
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
            className="w-full pr-9 pl-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors"
          />
        </div>
      </div>
      {/* Contacts */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
        {contactsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-slate-100 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-2 w-32 bg-slate-100 dark:bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : contacts.length === 0 ? (
          <p className="text-center py-8 text-sm text-slate-400">لا توجد نتائج</p>
        ) : (
          contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onStartConversation(contact.id)}
              disabled={startMutationPending}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors text-right disabled:opacity-60"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {contact.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{contact.email}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
