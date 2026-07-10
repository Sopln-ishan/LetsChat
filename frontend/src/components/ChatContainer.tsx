import ChatHeader from "./ChatHeader";
import InputMessageField from "./InputMessageField";
import MessageContainer from "./MessageContainer";

const ChatContainer = () => {
  return (
    <div className="w-full flex flex-col h-full bg-slate-800/30">
      <div className="chat-header shrink-0">
        <ChatHeader />
      </div>

      <div className="message-container flex-1 flex flex-col overflow-hidden">
        <MessageContainer />
      </div>

      <div className="input-message-field shrink-0">
        <InputMessageField />
      </div>
    </div>
  );
};

export default ChatContainer;
