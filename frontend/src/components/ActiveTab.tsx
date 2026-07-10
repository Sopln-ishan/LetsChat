import useChatStore from "../store/useChatStore";

const ActiveTab = () => {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div role="tablist" className="tabs tabs-box bg-slate-800/40 w-full">
      <button
        role="tab"
        className={`tab flex-1 text-sm font-medium transition-all duration-200 ${
          activeTab === "chats"
            ? "tab-active bg-emerald-500/20! text-emerald-400!"
            : "text-slate-400 hover:text-white hover:bg-slate-700/50"
        }`}
        onClick={() => setActiveTab("chats")}
      >
        Chats
      </button>
      <button
        role="tab"
        className={`tab flex-1 text-sm font-medium transition-all duration-200 ${
          activeTab === "contacts"
            ? "tab-active bg-emerald-500/20! text-emerald-400!"
            : "text-slate-400 hover:text-white hover:bg-slate-700/50"
        }`}
        onClick={() => setActiveTab("contacts")}
      >
        Contacts
      </button>
    </div>
  );
};

export default ActiveTab;
