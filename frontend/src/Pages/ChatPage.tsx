import useAuthStore from "../store/useAuthStore";

const ChatPage = () => {
  const { logout } = useAuthStore();

  return (
    <div className="w-full h-screen z-10">
      <button className="btn btn-primary" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default ChatPage;
