import { IoClose } from "react-icons/io5";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

const ChatHeader = () => {
  const { activeChat, setActiveChat } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="chat-header flex items-center justify-between w-full px-5 py-4 border-b border-slate-700/50 bg-slate-800/60 backdrop-blur-xl">
      {/* Left side — avatar + user info */}
      <div className="chat-header-user flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`chat-header-avatar avatar avatar-${activeChat && Object.keys(onlineUsers).includes(activeChat._id) ? "online" : ""}`}
        >
          <div className="w-10 rounded-full">
            <img
              src={activeChat?.profilePic || "/defaultAvatar.webp"}
              alt={activeChat?.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name & status */}
        <div className="chat-header-info flex flex-col min-w-0">
          <h3 className="chat-header-name text-sm font-semibold text-white leading-tight truncate">
            {activeChat?.fullName}
          </h3>
          <p className="chat-header-status text-xs text-emerald-400 truncate">
            {activeChat && Object.keys(onlineUsers).includes(activeChat._id)
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>

      {/* Right side — close button */}
      <div className="tooltip tooltip-bottom" data-tip="Close chat">
        <button
          onClick={() => setActiveChat(null as any)}
          className="chat-header-close btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
        >
          <IoClose size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
