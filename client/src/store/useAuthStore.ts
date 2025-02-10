import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

// Define a type for the store's state
interface AuthStoreState {
  authUser: any | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async () => {
    try {
      const res = await axiosInstance.post("/auth/signup")
      
    } catch (error) {
      
    }
  }
}));