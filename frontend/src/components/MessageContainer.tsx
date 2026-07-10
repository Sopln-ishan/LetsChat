import { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

const MessageContainer = () => {
  const { activeChat, isFetchingMessages, chatMessages, getMessagesByUserId } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessagesByUserId(activeChat?._id);
  }, [getMessagesByUserId, activeChat]);

  useEffect(() => {
    if (messageEndRef.current && chatMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  if (isFetchingMessages) {
    return <MessagesLoadingSkeleton />;
  }

  return (
    <div className="message-list-container flex-1 overflow-y-auto px-5 py-4 flex flex-col scrollbar-thin scrollbar-thumb-slate-700">
      {/* Spacer pushes messages to the bottom when there are few */}
      <div className="flex-1" />

      <div className="space-y-4">
        {chatMessages.map((message) => {
        const isSentByMe = message.senderId === authUser?._id;
        const profilePic = isSentByMe
          ? authUser?.profilePic || "/defaultAvatar.webp"
          : activeChat?.profilePic || "/defaultAvatar.webp";

        return (
          <div
            key={message._id}
            className={`message-wrapper chat ${
              isSentByMe ? "chat-end" : "chat-start"
            }`}
          >
            <div className="message-avatar-section chat-image avatar">
              <div className="w-8 h-8 rounded-full border border-slate-700/50">
                <img src={profilePic} alt="profile" className="object-cover" />
              </div>
            </div>

            <div className="message-header-section chat-header mb-1 text-slate-400 text-xs">
              <span className="mr-1">
                {isSentByMe ? "You" : activeChat?.fullName}
              </span>
            </div>

            <div
              className={`message-bubble-section chat-bubble flex flex-col ${
                isSentByMe
                  ? "bg-emerald-600/90 text-white"
                  : "bg-slate-700/80 text-slate-200"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-1 object-cover"
                />
              )}
              {message.text && (
                <p className="message-text-content leading-relaxed">
                  {message.text}
                </p>
              )}
            </div>
          </div>
        );
      })}
      
      <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default MessageContainer;
