import { BiMessageDetail } from "react-icons/bi";

const NoChatsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-slate-700/30 rounded-full p-4 mb-4">
        <BiMessageDetail size={28} className="text-slate-500" />
      </div>
      <p className="text-sm font-medium text-slate-400">No chats found</p>
      <p className="text-xs text-slate-500 mt-1">
        Start a conversation from the Contacts tab
      </p>
    </div>
  );
};

export default NoChatsFound;
