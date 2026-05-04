import { ArrowRight, Plus } from "lucide-react";
import type { Conversation } from "../types";

interface ChatHeaderProps {
  view: "list" | "messages" | "new";
  activeConversation: Conversation | null;
  goBack: () => void;
  setView: (view: "list" | "messages" | "new") => void;
}

export default function ChatHeader({ view, activeConversation, goBack, setView }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 shrink-0">
      {view !== "list" && (
        <button
          onClick={goBack}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors shrink-0"
        >
          <ArrowRight size={16} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        {view === "list" && (
          <p className="text-white font-semibold text-sm">المحادثات</p>
        )}
        {view === "messages" && (
          <div>
            <p className="text-white font-semibold text-sm truncate">
              {activeConversation?.other_party.name}
            </p>
            <p className="text-white/60 text-xs truncate">
              {activeConversation?.other_party.role ?? activeConversation?.other_party.email}
            </p>
          </div>
        )}
        {view === "new" && (
          <p className="text-white font-semibold text-sm">محادثة جديدة</p>
        )}
      </div>
      {view === "list" && (
        <button
          onClick={() => setView("new")}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          title="محادثة جديدة"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
