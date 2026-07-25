import { create } from "zustand";
import api from "../services/axios";
import { useAuthStore } from "./authStore";
import toast from "react-hot-toast";


export const useChatStore = create((set, get) => ({

    users: [],
    conversations: [],
    isMessagesLoading: false,
    messages: [],
    selectedUser: null,
    isProfileOpen: false,
    isTyping: false,
    isNewChatOpen: false,
    isConversationLoading: false,
    isInitialLoading: true,
    isSendingMessage: false,
    showChatOnMobile: false,
    showEmojiPicker: false,
    messageText: "",
    sharedMedia: [],
    isSharedMediaLoading: false,
    isHydrated: false,
    isUsersLoading: false,


    setSelectedUser: (user) => {
        if (user) {
            localStorage.setItem("selectedUser", user._id);
        }
        set({
            selectedUser: user,
            isProfileOpen: false,
            sharedMedia: [],
        });
    },

    restoreSelectedUser: (user) => {
        set({
            selectedUser: user,
            showChatOnMobile: window.innerWidth < 768,
            isHydrated: true,
        });
    },

    setIsProfileOpen: (value) => {
        set({ isProfileOpen: value })
    },

    setIsNewChatOpen: (value) => {
        set({ isNewChatOpen: value })
    },

    setShowChatOnMobile: (value) => {
        set({ showChatOnMobile: value });
    },

    setShowEmojiPicker: (value => {
        set({ showEmojiPicker: value });
    }),

    setMessageText: (text) => {
        set({ messageText: text });
    },



    addTempMessage: (message) => {
        set({
            messages: [
                ...get().messages,
                message
            ]
        });
    },


    getUsers: async () => {
        try {
            set({ isUsersLoading: true });

            const response = await api.get("/users");

            set({
                users: response.data.users,
                isUsersLoading: false,
            });

        } catch (error) {
            console.log(error);
            set({ isUsersLoading: false });
        }
    },


    getConversations: async (showInitialLoader = false) => {
        try {
            if (showInitialLoader) {
                set({ isInitialLoading: true });

            }

            set({ isConversationLoading: true });

            const response = await api.get("/conversations");

            set({
                conversations: response.data.conversations,
                isConversationLoading: false,
                isInitialLoading: false,
                isHydrated: true,
            });

            const selectedUserId = localStorage.getItem("selectedUser");

            if (selectedUserId) {
                const conversation = response.data.conversations.find(
                    (conversation) => conversation.user._id === selectedUserId
                );

                if (!conversation) {
                    localStorage.removeItem("selectedUser");
                } else {
                    const currentUser = get().selectedUser;

                    if (currentUser?._id !== conversation.user._id) {
                        get().restoreSelectedUser(conversation.user);
                    }
                }

            }

        } catch (error) {
            console.log(error);
            set({ isConversationLoading: false });
            set({ isInitialLoading: false });

        }
    },


    getMessages: async (userId) => {
        try {
            set({ isMessagesLoading: true });
            const response = await api.get(`/messages/${userId}`);

            set({
                messages: response.data.messages,
                isMessagesLoading: false,
            });

            await api.put(`/messages/seen/${userId}`);

            // await get().getConversations();

        } catch (error) {
            set({ isMessagesLoading: false });
            console.log(error);
        }
    },

    getSharedMedia: async (userId) => {
        try {
            set({ isSharedMediaLoading: true });

            const response = await api.get(`/messages/shared-media/${userId}`);
            set({
                sharedMedia: response.data.images,
                isSharedMediaLoading: false,
            });

        } catch (error) {
            console.log(error);
            set({ isSharedMediaLoading: false });
        }
    },


    sendMessage: async (receiverId, formData, tempId) => {
        try {
            set({ isSendingMessage: true });
            const response = await api.post(`/messages/send/${receiverId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            set({
                messages:
                    get().messages.map((message) =>
                        message.tempId === tempId
                            ? response.data.data
                            : message
                    )
            });
            set({ isSendingMessage: false });

            await get().getConversations(false);

            if (formData.get("image")) {
                if (get().isProfileOpen) {
                    await get().getSharedMedia(receiverId);
                }
            }

        } catch (error) {
            console.log(error);
            set({ isSendingMessage: false });
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    },

    deleteMessage: async (messageId) => {
        try {

            const response = await api.delete(`/messages/${messageId}`);

            set({
                messages: get().messages.filter((message) => message._id !== response.data.messageId)
            });

            const selectedUserId = get().selectedUser._id;

            set({
                conversations: get().conversations.map((conversation) => {

                    if (conversation.user._id === selectedUserId) {
                        return {
                            ...conversation,
                            lastMessage: response.data.lastMessage,
                            lastMessageTime: response.data.lastMessageTime,
                        }
                    }

                    return conversation;

                })
            });

            if (get().isProfileOpen) {
                await get().getSharedMedia(selectedUserId);
            }

        } catch (error) {
            console.log(error.response?.data?.message || error);
            toast.error(error?.response?.data?.message || "Failed to delete message");
        }
    },

    deleteConversation: async (userId) => {

        const previousConversations = get().conversations;

        try {

            set({
                conversations: get().conversations.filter(conversation => conversation.user._id !== userId)
            });

            if (get().selectedUser?._id === userId) {
                set({
                    selectedUser: null,
                    showChatOnMobile: false,
                });
            }

            await api.delete(`/conversations/${userId}`);


        } catch (error) {
            set({
                conversations: previousConversations,
            })
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to delete chat");
        }
    },


    unhideConversation: async (userId) => {
        try {
            await api.put(`/conversations/unhide/${userId}`);

            await get().getConversations(false);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to open chat");
        }
    },


    subscribeToMessages: () => {

        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("newMessage");
        socket.off("userTyping");
        socket.off("userStopTyping");
        socket.off("messagesSeen");
        socket.off("messageDeleted");

        socket.on("newMessage", async (newMessage) => {

            const selectedUser = get().selectedUser;

            if (selectedUser?._id === newMessage.senderId.toString()) {


                set((state) => ({
                    messages: [
                        ...state.messages,
                        newMessage
                    ],
                }));


                await api.put(`/messages/seen/${newMessage.senderId}`);

            }

            get().getConversations(false);

        });

        socket.on("userTyping", () => {
            set({
                isTyping: true
            });
        });

        socket.on("userStopTyping", () => {
            set({
                isTyping: false
            });
        });

        socket.on("messagesSeen", (messageIds) => {
            set({
                messages: get().messages.map((message) => {
                    if (messageIds.includes(message._id)) {
                        return {
                            ...message,
                            seen: true,
                        }
                    }
                    return message;
                }),
            });
        });

        socket.on("messageDeleted", (data) => {
            set({
                messages: get().messages.filter((message) => message._id !== data.deletedMessageId)
            });

            const selecteduserId = get().selectedUser?._id;

            set({
                conversations: get().conversations.map((conversation) => {
                    if (conversation.user._id === selecteduserId) {
                        return {
                            ...conversation,
                            lastMessage: data.lastMessage,
                            lastMessageTime: data.lastMessageTime,
                        }
                    }
                    return conversation;
                })
            });

        })
    },


    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("newMessage");
        socket.off("userTyping");
        socket.off("userStopTyping");
        socket.off("messagesSeen");
        socket.off("messageDeleted");
    },

}));