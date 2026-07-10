import { create } from "zustand";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/Axios";

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: string) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignUpData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || "Sign up failed";
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || "Logout failed";
      toast.error(`Error loggin out: ${message}`);
    }
  },

  updateProfile: async (data: string) => {
    try {
      const res = await axiosInstance.put("/auth/update-user", {
        profilePic: data,
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Update profile failed";
      toast.error(message);
    }
  },
}));

export default useAuthStore;
