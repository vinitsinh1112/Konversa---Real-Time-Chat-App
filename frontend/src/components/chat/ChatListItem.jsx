import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { HiDotsVertical } from 'react-icons/hi';


const ChatListItem = ({ conversation }) => {

    const { selectedUser, setSelectedUser, setShowChatOnMobile, setIsProfileOpen, deleteConversation } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const user = conversation.user;
    const isSelected = selectedUser?._id === user._id;
    const isOnline = onlineUsers.includes(user._id);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const menuRef = useRef(null);
    const longPressTimer = useRef(null);


    const handleTouchStart = () => {

        if (window.innerWidth >= 768) return;

        longPressTimer.current = setTimeout(() => {
            setShowDeleteModal(true);
        }, 600);

    }

    const handleTouchEnd = () => {
        clearTimeout(longPressTimer.current);
    }


    useEffect(() => {

        const handleClickOutside = (event) => {

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, []);


    return (
        <>
            <div
                onClick={() => {
                    setIsProfileOpen(false);
                    setSelectedUser(user);

                    if (window.innerWidth < 768) {
                        setShowChatOnMobile(true);
                    }
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-100 group
             ${isSelected
                        ? "bg-zinc-800 border border-zinc-700 shadow-md shadow-black/20"
                        : "border border-transparent  hover:bg-zinc-800/80 hover:border-zinc-700"
                    }`}
            >
                <div className='relative'>
                    <div className='w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center font-semibold'>
                        {user?.profilePic ? (
                            <img
                                src={user?.profilePic}
                                alt='profile pic'
                                className='w-12 h-12 rounded-full object-cover'
                            />
                        ) : (
                            <div>
                                {user.fullName?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-green-500" : "bg-zinc-500"}`}></div>

                </div>

                <div className='flex-1 min-w-0'>
                    <div className='flex justify-between'>
                        <h3 className='font-medium truncate'>{user.fullName}</h3>

                        {conversation.unreadCount > 0 && (
                            <span className='min-w-4 h-4 px-1 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center'>
                                {conversation.unreadCount}
                            </span>
                        )}

                    </div>

                    <p className='text-sm text-zinc-400 truncate'>{conversation.lastMessage}</p>
                </div>

                <div
                    ref={menuRef}
                    className='relative'
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className={`hidden lg:block transition-opacity cursor-pointer p-1 text-zinc-400 hover:text-white ${isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                        <HiDotsVertical size={22} />
                    </button>

                    {isMenuOpen && (
                        <div className='absolute right-0 top-7 z-50 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden min-w-32'>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(false);
                                    setShowDeleteModal(true);
                                }}
                                className='w-full text-center p-2 text-red-400 hover:bg-zinc-700 cursor-pointer'
                            >
                                Delete Chat
                            </button>
                        </div>
                    )}

                </div>

            </div>

            {showDeleteModal && (
                <div
                    className='fixed inset-0 p-5 bg-black/50 flex items-center justify-center z-100'
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className='bg-zinc-900 border border-zinc-700 rounded-lg p-5 w-full max-w-sm'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className='text-white font-semibold text-lg'>Delete Chat</h3>

                        <p className='text-zinc-400 text-sm mt-2'>Are you sure you want to delete this chat?</p>

                        <div className='flex justify-end gap-3 mt-5'>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                }}
                                className='px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer transition duration-100'
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    deleteConversation(user._id);
                                    setShowDeleteModal(false);
                                }}
                                className='px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer transition duration-100'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* <hr className="border-zinc-700 " /> */}

        </>
    )
}

export default ChatListItem
