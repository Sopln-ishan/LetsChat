import { useEffect, useLayoutEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

const formatMessageTime = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MessageContainer = () => {
  const {
    activeChat,
    isFetchingMessages,
    chatMessages,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
    fetchMoreMessagesIfAvailable,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageStartRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const firstMessageIdRef = useRef<string | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const previousScrollHeightRef = useRef<number>(0);

  // implementing cursor based pagination
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const cursor = chatMessages.length > 0 ? chatMessages[0]._id : null;

          if (cursor) {
            fetchMoreMessagesIfAvailable(cursor);
          }
        }
      },
      { threshold: 1.0 },
    );

    if (messageStartRef.current) {
      observer.observe(messageStartRef.current);
    }

    return () => {
      if (messageStartRef.current) {
        observer.unobserve(messageStartRef.current);
      }
    };
  }, [chatMessages, fetchMoreMessagesIfAvailable]);

  useEffect(() => {
    getMessagesByUserId(activeChat?._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    getMessagesByUserId,
    activeChat,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || chatMessages.length === 0) return;

    const currentFirstMessageId = chatMessages[0]._id;
    const currentLastMessageId = chatMessages[chatMessages.length - 1]._id;

    // 1. Check if we just loaded older messages (prepended)
    if (firstMessageIdRef.current && firstMessageIdRef.current !== currentFirstMessageId) {
      const heightDifference = container.scrollHeight - previousScrollHeightRef.current;
      container.scrollTop += heightDifference;
    } 
    // 2. Check if a new message arrived or it's the initial load
    else if (lastMessageIdRef.current !== currentLastMessageId) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Update refs for next cycle
    firstMessageIdRef.current = currentFirstMessageId;
    lastMessageIdRef.current = currentLastMessageId;
    previousScrollHeightRef.current = container.scrollHeight;
  }, [chatMessages]);

  if (isFetchingMessages) {
    return <MessagesLoadingSkeleton />;
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="message-list-container flex-1 overflow-y-auto px-5 py-4 flex flex-col scrollbar-thin scrollbar-thumb-slate-700"
    >
      {/* Spacer pushes messages to the bottom when there are few */}
      <div className="flex-1" />

      <div ref={messageStartRef} />

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
                  <img
                    src={profilePic}
                    alt="profile"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="message-header-section chat-header mb-1 text-slate-400 text-xs flex items-center gap-1.5">
                <span className="font-medium">
                  {isSentByMe ? "You" : activeChat?.fullName}
                </span>
                <time className="text-[10px] opacity-60">
                  {formatMessageTime(message.createdAt ?? "")}
                </time>
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
