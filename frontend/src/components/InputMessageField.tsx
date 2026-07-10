import { IoImageOutline, IoSend } from "react-icons/io5";

const InputMessageField = () => {
  return (
    <div className="p-4 border-t border-slate-700/50 bg-slate-800/60 backdrop-blur-xl w-full mt-auto">
      <form className="flex items-center gap-3 w-full">
        {/* Attach Image Button */}
        <button
          type="button"
          className="btn btn-circle btn-ghost text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0"
          title="Attach image"
        >
          <IoImageOutline size={22} />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full bg-slate-700/50 border border-slate-600 rounded-full py-3 px-5 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-circle bg-emerald-600 hover:bg-emerald-500 border-none text-white shrink-0 shadow-lg shadow-emerald-500/20"
          title="Send message"
        >
          <IoSend size={18} className="ml-1" />
        </button>
      </form>
    </div>
  );
};

export default InputMessageField;
