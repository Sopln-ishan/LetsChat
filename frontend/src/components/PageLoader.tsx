import { ImSpinner8 } from "react-icons/im";

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
      <ImSpinner8 className="animate-spin size-20 text-cyan-500" />
    </div>
  );
};

export default PageLoader;
