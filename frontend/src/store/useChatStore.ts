import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import useAuthStore from "./useAuthStore";

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface Messages {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt?: string;
}

interface MessageData {
  text?: string;
  image?: string;
}

interface ChatStore {
  allContacts: Contact[];
  allChats: Contact[];
  activeTab: "chats" | "contacts";
  activeChat: Contact;
  chatMessages: Messages[];
  isFetchingChatPartners: boolean;
  isFetchingContacts: boolean;
  isFetchingMessages: boolean;

  getChatPartners: () => Promise<void>;
  getContacts: () => Promise<void>;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setActiveChat: (chat: Contact) => void;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessageData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
  allContacts: [],
  allChats: [],
  activeTab: "chats",
  activeChat: null,
  chatMessages: [],
  isFetchingChatPartners: false,
  isFetchingContacts: false,
  isFetchingMessages: false,

  getChatPartners: async () => {
    try {
      set({ isFetchingChatPartners: true });
      const res = await axiosInstance.get("/messages/chats");
      set({ allChats: res.data });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to fetch chats";
      toast.error(message);
    } finally {
      set({ isFetchingChatPartners: false });
    }
  },
  getContacts: async () => {
    try {
      set({ isFetchingContacts: true });
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to fetch contacts";
      toast.error(message);
    } finally {
      set({ isFetchingContacts: false });
    }
  },
  setActiveTab: (tab: "chats" | "contacts") => {
    set({ activeTab: tab });
  },
  setActiveChat: (chat: Contact) => {
    set({ activeChat: chat });
  },

  getMessagesByUserId: async (userId: string) => {
    try {
      set({ isFetchingMessages: true });
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ chatMessages: res.data });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to fetch messages";
      toast.error(message);
    } finally {
      set({ isFetchingMessages: false });
    }
  },

  sendMessage: async (messageData: MessageData) => {
    const { activeChat, chatMessages } = get();
    const { authUser } = useAuthStore.getState();

    try {
      //optimistic message - goes even before it is put into the backend
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        _id: tempId,
        senderId: authUser._id,
        receiverId: activeChat._id,
        text: messageData.text,
        image: messageData.image,
        createdAt: new Date().toISOString(),
      };

      set({ chatMessages: [...chatMessages, optimisticMessage] });

      const res = await axiosInstance.post(
        `/messages/send/${activeChat._id}`,
        messageData,
      );
      set({ chatMessages: [...chatMessages, res.data] });
    } catch (error) {
      // remove optimistic message on failure
      set({ chatMessages });
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to send message";
      toast.error(message);
    }
  },

  subscribeToMessages: () => {
    const { activeChat } = get();
    const { socket } = useAuthStore.getState();

    if (!activeChat) {
      return;
    }

    socket.on("newMessage", (newMessage) => {
      const isReceivedFromActiveChat = newMessage.senderId === activeChat._id;
      if (!isReceivedFromActiveChat) {
        return;
      }

      const currentMessages = get().chatMessages;
      set({ chatMessages: [...currentMessages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    socket.off("newMessage");
  },
}));

export default useChatStore;
