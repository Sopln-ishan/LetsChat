import ActiveTab from "../components/ActiveTab";
import ChatContainer from "../components/ChatContainer";
import ChatList from "../components/ChatList";
import ContactList from "../components/ContactList";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ProfileHeader from "../components/ProfileHeader";
import useChatStore from "../store/useChatStore";

const ChatPage = () => {
  const { activeTab, activeChat } = useChatStore();

  return (
    <div className="z-10 flex h-screen w-full">
      {/* Sidebar / contact-list panel */}
      <aside className="flex w-full max-w-sm flex-col bg-slate-800/60 backdrop-blur-xl border-r border-slate-700/50 overflow-hidden">
        {/* Profile header */}
        <header className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
          <ProfileHeader />
        </header>

        {/* Tabs */}
        <nav className="px-4 pt-3">
          <ActiveTab />
        </nav>

        {/* Divider */}
        <div className="divider my-0 px-4" />

        {/* Chat / Contact list — scrollable */}
        {/* TODO: fix the online option and make it work with socket */}
        <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-slate-700">
          {activeTab === "chats" ? <ChatList /> : <ContactList />}
        </div>
      </aside>

      {/* Main chat area (placeholder for future conversation view) */}
      <main className="hidden lg:flex flex-1 items-center justify-center">
        <div className="w-full h-full">
          {activeChat ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
