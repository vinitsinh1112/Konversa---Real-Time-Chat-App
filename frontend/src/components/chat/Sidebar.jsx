import React, { useEffect, useRef, useState } from 'react'
import { HiDotsVertical } from "react-icons/hi";
import { FaCirclePlus } from "react-icons/fa6";
import ChatListItem from './ChatListItem';
import { useChatStore } from '../../store/chatStore';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/authStore';
import NewChatModal from './NewChatModal';


const Sidebar = () => {

    const { conversations, getConversations, setIsNewChatOpen } = useChatStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { logout } = useAuthStore();


    useEffect(() => {
        getConversations(true);
    }, []);


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

    }, [])

    const filteredConversations = conversations.filter((conversation) => {

        const searchText = search.toLowerCase();

        return (
            conversation.user.fullName?.toLowerCase().includes(searchText) || conversation.user.email?.toLowerCase().includes(searchText)
        );

    });

    return (
        <>
            <div className='w-full md:w-72 lg:W-80 h-screen bg-zinc-900 text-white border-r border-zinc-700 flex flex-col'>
                <div className='h-16 px-4 border-b border-zinc-700 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold'>
                            K
                        </div>
                        <h2 className='font-semibold text-lg'>Konversa</h2>
                    </div>


                    {/* Dropdown */}
                    <div ref={menuRef} className='relative'>
                        <button onClick={() => setIsNewChatOpen(true)} className='p-2 rounded-full hover:bg-zinc-800 transition cursor-pointer'><FaCirclePlus size={20} /></button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='p-2 rounded-full hover:bg-zinc-800 transition cursor-pointer'><HiDotsVertical size={20} /></button>

                        {isMenuOpen && (
                            <div className='absolute right-0 mt-2 w-40 bg-zinc-800 rounded-md shadow-lg border border-zinc-700 overflow-hidden z-50'>
                                <button
                                    onClick={() => {
                                        navigate("/profile");
                                        setIsMenuOpen(false)
                                    }}
                                    className='w-full text-left px-4 py-3 hover:bg-zinc-700 cursor-pointer'
                                >
                                    My Profile
                                </button>

                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false)
                                    }}
                                    className='w-full text-left px-4 py-3 hover:bg-zinc-700 cursor-pointer text-red-400'
                                >
                                    Logout
                                </button>

                            </div>
                        )}

                    </div>

                </div>

                <div className='p-4'>
                    <input
                        type='text'
                        placeholder='Search users...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='w-full bg-zinc-800 text-white rounded-xl px-3 py-2 border outline-none'
                    />
                </div>

                <div className='flex-1 overflow-y-auto px-2 pb-2'>
                    {filteredConversations.map((conversation) => (
                        <ChatListItem
                            key={conversation._id}
                            conversation={conversation}

                        />
                    ))}
                </div>
            </div>
            <NewChatModal />
        </>
    )
}

export default Sidebar
