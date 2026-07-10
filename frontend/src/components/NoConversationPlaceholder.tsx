import { BiMessageSquareDots } from "react-icons/bi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { FiUsers } from "react-icons/fi";

const NoConversationPlaceholder = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-16 px-8">
      {/* Main icon */}
      <div className="relative mb-6">
        <div className="bg-emerald-500/10 rounded-full p-6">
          <HiOutlineChatBubbleLeftRight size={48} className="text-emerald-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-slate-700/80 rounded-full p-1.5">
          <BiMessageSquareDots size={18} className="text-slate-400" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-white mb-2">
        No conversations yet
      </h2>

      {/* Description */}
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
        Select a contact from the sidebar to start a new conversation
      </p>

      {/* Hint */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-4 py-2.5 rounded-lg">
        <FiUsers size={14} className="text-emerald-500/70" />
        <span>Browse the <strong className="text-slate-400">Contacts</strong> tab to get started</span>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
