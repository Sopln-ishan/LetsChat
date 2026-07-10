import { useRef, useState } from "react";
import { IoImageOutline, IoSend, IoClose } from "react-icons/io5";
import useChatStore from "../store/useChatStore";

const InputMessageField = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const { sendMessage } = useChatStore();
  const imageInputRef = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageSubmit = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();

    if (image) {
      reader.readAsDataURL(image);
      reader.onloadend = () => setImagePreview(reader.result);
    }
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    await sendMessage({ text: text.trim(), image: imagePreview });
    setText("");
    removeImagePreview();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className="p-4 border-t border-slate-700/50 bg-slate-800/60 backdrop-blur-xl w-full mt-auto">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-xl border border-slate-600/50 shadow-sm"
            />
            <button
              onClick={removeImagePreview}
              type="button"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center border border-slate-500 shadow-md transition-colors"
              title="Remove image"
            >
              <IoClose size={14} />
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 w-full"
      >
        {/* Attach Image Button */}
        <button
          type="button"
          className="btn btn-circle btn-ghost text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0"
          title="Attach image"
          onClick={() => imageInputRef.current?.click()}
        >
          <IoImageOutline size={22} />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSubmit}
            className="hidden"
            ref={imageInputRef}
          />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Type a message..."
            rows={1}
            ref={textareaRef}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-2xl py-3 px-5 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
            style={{ lineHeight: "1.5" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
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
