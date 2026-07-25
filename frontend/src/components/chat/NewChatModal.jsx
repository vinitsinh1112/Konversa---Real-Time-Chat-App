import React, { useEffect, useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import { IoMdCloseCircle } from "react-icons/io";


const NewChatModal = () => {

    const { isNewChatOpen, setIsNewChatOpen, users, getUsers, setSelectedUser, unhideConversation, setShowChatOnMobile, isUsersLoading } = useChatStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (isNewChatOpen) {
            getUsers();
        }
    }, [isNewChatOpen]);

    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase())
    );


    if (!isNewChatOpen) return null;


    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setIsNewChatOpen(false)}>
            <div className='w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-3' onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">New Chat</h2>

                    <button
                        onClick={() => setIsNewChatOpen(false)}
                        className="flex items-center justify-center w-9 h-9 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        aria-label="Close"
                    >
                        <IoMdCloseCircle size={24} />
                    </button>
                </div>

                <input
                    type='text'
                    placeholder='Search users...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full px-4 py-3 mb-4 rounded-xl bg-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:outline-violet-500 transition'
                />

                <div className='space-y-2 max-h-96 overflow-y-auto'>

                    {isUsersLoading ? (
                        <p className='text-center text-zinc-500 py-4'>Loadin users...</p>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                onClick={async () => {
                                    setSelectedUser(user);
                                    setIsNewChatOpen(false);

                                    if (window.innerWidth < 768) {
                                        setShowChatOnMobile(true);
                                    }

                                    unhideConversation(user._id);
                                }}
                                className='flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 cursor-pointer transition'
                            >
                                <div className='w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-semibold text-white'>
                                    {user.fullName?.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h3 className='text-white'>{user.fullName}</h3>
                                    <p className='text-sm text-white opacity-70'>{user.email}</p>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className='text-center text-zinc-500 py-4'>No users found</p>
                    )}

                </div>
            </div>
        </div>
    )
}

export default NewChatModal
