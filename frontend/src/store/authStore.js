import { create } from "zustand";
import api from "../services/axios";
import { io } from "socket.io-client";
import { useChatStore } from "./chatStore";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isLoading: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],

    setAuthUser: (user) => set({ authUser: user }),

    checkAuth: async () => {
        try {
            const response = await api.get("/auth/me");

            set({
                authUser: response.data.user,
                isCheckingAuth: false,
            });

            get().connectSocket();

        } catch (error) {
            set({
                authUser: null,
                isCheckingAuth: false,
            });
        }
    },

    register: async (formData) => {
        try {
            set({ isLoading: true });

            const response = await api.post("/auth/register", formData);

            set({ authUser: response.data.user });
            toast.success("Account created successfully");
            get().connectSocket();

            return response.data;

        } catch (error) {
            toast.error(error?.response?.data?.message || "Registration failed");

        } finally {
            set({ isLoading: false });
        }
    },

    login: async (formData) => {
        try {
            set({ isLoading: true });

            const response = await api.post("/auth/login", formData);

            set({ authUser: response.data.user });
            toast.success("Login successful");
            get().connectSocket();

            return response.data;

        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Unable to connect to server.");

        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true });

            await api.post("/auth/logout");

            get().socket?.disconnect();
            set({ authUser: null, socket: null, onlineUsers: [] });
            useChatStore.setState({ selectedUser: null });
            localStorage.removeItem("selectedUser");
            toast.success("Logged out");

        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");

        } finally {
            set({ isLoading: false });
        }
    },


    connectSocket: () => {

        if (get().socket?.connected) return;

        const authUser = get().authUser;

        const socket = io(
            import.meta.env.VITE_BACKEND_URL,
            {
                withCredentials: true,
                query: {
                    userId: authUser._id,
                }
            }
        );

        socket.on("connect_error", (err) => {
            console.log("Socker error: ", err.message);
        });

        socket.on("error", (err) => {
            console.log("Manager error: ", err);
        });

        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({
                onlineUsers: userIds
            });
        });

        socket.on("connect", () => {
            console.log("Socket Connected: ", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
    },

    updateProfile: async (formData) => {
        try {
            set({ isLoading: true });

            const response = await api.put("/users/profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            set({ authUser: response.data.user });

            return response.data;

        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile");

        } finally {
            set({ isLoading: false });
        }
    }

}));