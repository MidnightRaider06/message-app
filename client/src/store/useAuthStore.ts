import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = "http://localhost:5001";

// Define a type for the store's state
interface AuthStoreState {
  authUser: any | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: any[];
  socket: any | null;
  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

// Define a type for sign up data
interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

// Define a type for log in data
interface LoginData {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignUpData) => {
    set({ isSigningUp: true});
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({authUser: res.data});
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
      
    } finally {
      set({isSigningUp: false});
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket()
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async() => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null});
      toast.success("Logged out succesfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async(data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Changed profile picture successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const {authUser} = get();
    if (!authUser || get().socket?.connected) {
      return;
    } else {
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
    });
      socket.connect();
      set({socket: socket});

      socket.on("getOnlineUsers", (userIds) => {
        set({onlineUsers: userIds});
      });
    }
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },

}));