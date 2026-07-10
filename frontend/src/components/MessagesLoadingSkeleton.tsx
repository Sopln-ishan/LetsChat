const MessagesLoadingSkeleton = () => {
  const skeletonMessages = [
    { side: "start", width: "w-48" },
    { side: "start", width: "w-64" },
    { side: "end", width: "w-52" },
    { side: "start", width: "w-40" },
    { side: "end", width: "w-60" },
    { side: "end", width: "w-36" },
    { side: "start", width: "w-56" },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col scrollbar-thin scrollbar-thumb-slate-700">
      {/* Spacer pushes skeleton messages to the bottom */}
      <div className="flex-1" />
      
      <div className="space-y-4">
        {skeletonMessages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.side === "end" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex items-end gap-2 ${msg.side === "end" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar skeleton */}
            <div className="w-8 h-8 rounded-full shrink-0 bg-slate-700/50 animate-pulse" />

            {/* Message bubble skeleton */}
            <div
              className={`${msg.width} h-10 rounded-2xl bg-slate-700/50 animate-pulse ${
                msg.side === "end" ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
            />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default MessagesLoadingSkeleton;
