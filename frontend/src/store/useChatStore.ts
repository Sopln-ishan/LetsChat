import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface ChatStore {
  allContacts: Contact[];
  allChats: Contact[];
  activeTab: "chats" | "contacts";
  activeChat: string;
  isFetchingChatPartners: boolean;
  isFetchingContacts: boolean;

  getChatPartners: () => Promise<void>;
  getContacts: () => Promise<void>;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setActiveChat: (chat: string) => void;
}

const useChatStore = create<ChatStore>((set) => ({
  allContacts: [],
  allChats: [],
  activeTab: "chats",
  activeChat: null,
  isFetchingChatPartners: false,
  isFetchingContacts: false,

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
  setActiveChat: (chat: string) => {
    set({ activeChat: chat });
  },
}));

export default useChatStore;
