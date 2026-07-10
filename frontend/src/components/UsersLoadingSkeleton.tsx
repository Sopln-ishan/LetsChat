const UsersLoadingSkeleton = () => {
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="flex flex-col gap-1 py-1">
      {skeletonRows.map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 rounded-xl animate-pulse"
        >
          {/* Avatar */}
          <div className="skeleton shrink-0 h-10 w-10 rounded-full bg-slate-700/50" />

          {/* Text lines */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="skeleton h-3 w-3/5 rounded bg-slate-700/50" />
            <div className="skeleton h-2.5 w-2/5 rounded bg-slate-700/50" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersLoadingSkeleton;
