import { useEffect } from "react";
import useChatStore from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

const ContactList = () => {
  const {
    allContacts,
    activeChat,
    isFetchingContacts,
    setActiveChat,
    getContacts,
  } = useChatStore();

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  if (isFetchingContacts) {
    return <UsersLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {allContacts.map((contact) => (
        <button
          key={contact._id}
          onClick={() => setActiveChat(contact)}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer
            ${
              activeChat === contact
                ? "bg-emerald-500/15 border border-emerald-500/20"
                : "bg-slate-700/20 hover:bg-slate-700/40 border border-transparent"
            }`}
        >
          {/* Avatar */}
          <div className="avatar avatar-online shrink-0">
            <div className="w-10 rounded-full">
              <img
                src={contact.profilePic || "/defaultAvatar.webp"}
                alt={contact.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name & email */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-sm font-medium text-white truncate w-full text-left">
              {contact.fullName}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ContactList;
