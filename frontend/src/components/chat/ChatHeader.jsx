import React from 'react'
import { useChatStore } from '../../store/chatStore'
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { useAuthStore } from '../../store/authStore';
import { IoArrowBack } from 'react-icons/io5';

const ChatHeader = () => {

    const { selectedUser, setSelectedUser, setIsProfileOpen, isProfileOpen, isTyping, setShowChatOnMobile } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const isOnline = onlineUsers.includes(selectedUser?._id);

    return (
        <div className='shrink-0 bg-zinc-900 h-16 border-b border-zinc-700 px-4 flex items-center justify-between'>
            <div className='flex items-center gap-3 min-w-0'>

                <button
                    onClick={() => {
                        setShowChatOnMobile(false);
                        setSelectedUser(null);
                        setIsProfileOpen(false);
                        localStorage.removeItem("selectedUser")
                    }}
                    className='md:hidden p-1 text-white'
                >
                    <IoArrowBack size={24} />
                </button>

                {selectedUser?.profilePic ? (
                    <img
                        src={selectedUser?.profilePic}
                        alt={selectedUser?.fullName}
                        className='w-10 h-10 rounded-full bg-zinc-500 object-cover'
                    />
                ) : (
                    <div className='w-10 h-10 rounded-full bg-blue-600 text-white text-lg flex items-center justify-center font-semibold'>
                        {selectedUser?.fullName.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className='min-w-0'>
                    <h2 className='font-semibold text-white truncate'>{selectedUser?.fullName}</h2>

                    <p className={`text-xs ${isTyping ? "text-blue-400" : isOnline ? "text-green-500" : "text-zinc-500"}`}>
                        {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className='p-2 text-zinc-200 z-30 rounded-full hover:bg-zinc-800 cursor-pointer transition'><IoIosInformationCircleOutline size={28} /></button>
        </div>
    )
}

export default ChatHeader
