import React, { useState, useRef } from "react";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";

const ChatListItem = ({ conversation }) => {
    const {
        selectedUser,
        setSelectedUser,
        setShowChatOnMobile,
        setIsProfileOpen,
        deleteConversation,
    } = useChatStore();

    const { onlineUsers } = useAuthStore();

    const user = conversation.user;
    const isSelected = selectedUser?._id === user._id;
    const isOnline = onlineUsers.includes(user._id);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
    });

    const longPressTimer = useRef(null);

    const handleTouchStart = () => {
        if (window.innerWidth >= 768) return;

        longPressTimer.current = setTimeout(() => {
            setShowDeleteModal(true);
        }, 600);
    };

    const handleTouchEnd = () => {
        clearTimeout(longPressTimer.current);
    };

    return (
        <>
            <div
                onClick={() => {
                    setContextMenu({
                        visible: false,
                        x: 0,
                        y: 0,
                    });

                    setIsProfileOpen(false);
                    setSelectedUser(user);

                    if (window.innerWidth < 768) {
                        setShowChatOnMobile(true);
                    }
                }}
                onContextMenu={(e) => {
                    if (window.innerWidth < 768) return;

                    e.preventDefault();

                    setContextMenu({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                    });
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                className={`relative flex items-center gap-3 p-3 mb-0.5 rounded-xl cursor-pointer transition-all duration-100
                ${isSelected
                        ? "bg-zinc-800 border border-zinc-700 shadow-md shadow-black/20"
                        : "border border-transparent hover:bg-zinc-800/80 hover:border-zinc-700"
                    }`}
            >
                {/* Avatar */}

                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center font-semibold">
                        {user?.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            user.fullName?.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-green-500" : "bg-zinc-500"
                            }`}
                    />
                </div>

                {/* Content */}

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold truncate">
                                {user.fullName}
                            </h3>

                            <p className="text-sm text-zinc-400 truncate mt-0.5">
                                {conversation.lastMessage}
                            </p>
                        </div>

                        <div className="flex flex-col items-end shrink-0 w-12">
                            <span className="text-[11px] text-zinc-500 leading-none">
                                {conversation.lastMessageTime
                                    ? new Date(
                                        conversation.lastMessageTime
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </span>

                            {conversation.unreadCount > 0 && (
                                <span className="mt-3 min-w-5 h-5 px-1 rounded-full bg-sky-500 text-white text-[11px] font-medium flex items-center justify-center leading-none">
                                    {conversation.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Context Menu */}

            {contextMenu.visible && (
                <>
                    <div
                        className="fixed inset-0 z-998"
                        onClick={() =>
                            setContextMenu({
                                visible: false,
                                x: 0,
                                y: 0,
                            })
                        }
                    />

                    <div
                        className="fixed z-999 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
                        style={{
                            top: contextMenu.y,
                            left: contextMenu.x,
                        }}
                    >
                        <button
                            onClick={() => {
                                setContextMenu({
                                    visible: false,
                                    x: 0,
                                    y: 0,
                                });

                                setShowDeleteModal(true);
                            }}
                            className="px-4 py-2 text-red-400 hover:bg-zinc-700 cursor-pointer whitespace-nowrap"
                        >
                            Delete Chat
                        </button>
                    </div>
                </>
            )}

            {/* Delete Modal */}

            {showDeleteModal && (
                <div
                    className="fixed inset-0 p-5 bg-black/50 flex items-center justify-center z-1000"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="bg-zinc-900 border border-zinc-700 rounded-lg p-5 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-white font-semibold text-lg">
                            Delete Chat
                        </h3>

                        <p className="text-zinc-400 text-sm mt-2">
                            Are you sure you want to delete this chat?
                        </p>

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await deleteConversation(user._id);
                                    setShowDeleteModal(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatListItem;