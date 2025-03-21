import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface ChatStoreType {
    messages: any[];
    users: any[];
    selectedUser: any | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (data: any) => Promise<void>;
    sendMessage: (data: any) => Promise<void>;
    listenToMessages: () => void;
    terminateListeningToMessages: () => void;
    setSelectedUser: (selectedUser: any) => void
}
export const useChatStore = create<ChatStoreType>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async() => {
        set({ isUsersLoading: true});

        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async(userId: any) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async(data: any) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);
            set({messages:[...messages, res.data]});
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },

    listenToMessages: () => {
        const {selectedUser} = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (message: any) => {
            if (message.senderId !== selectedUser._id) {
                return;
            }
            set({
                messages: [...get().messages, message],
            });
        });
    },

    terminateListeningToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),
}))