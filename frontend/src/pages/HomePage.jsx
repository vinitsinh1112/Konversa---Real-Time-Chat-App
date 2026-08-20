import React, { useEffect } from 'react';
import Sidebar from '../components/chat/Sidebar';
import NoChatSelected from '../components/chat/NoChatSelected';
import { useChatStore } from '../store/chatStore';
import ChatContainer from '../components/chat/ChatContainer';
import UserProfile from '../components/chat/UserProfile';



const HomePage = () => {

    const { selectedUser, setSelectedUser, showChatOnMobile, setShowChatOnMobile, isHydrated } = useChatStore();

    // useEffect(() => {
    //     const storedUser = localStorage.getItem("selectedUser");

    //     if (storedUser) {
    //         const user = JSON.parse(storedUser);

    //         setSelectedUser(user);

    //         if (window.innerWidth < 768) {
    //             setShowChatOnMobile(true);
    //         }

    //     }

    // }, []);

    return (
        <div className='h-dvh w-screen flex overflow-hidden bg-zinc-950'>

            {/* Desktop Sidebar */}
            <div className='hidden md:block shrink-0 h-full '>
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            {isHydrated && !showChatOnMobile && (
                <div className='w-full h-full overflow-hidden md:hidden'>
                    <Sidebar />
                </div>
            )}

            {/* Desktop Chat area */}
            <div className='hidden md:flex flex-1 min-w-0 min-h-0 overflow-hidden'>
                {selectedUser ? (
                    <ChatContainer />
                ) : (
                    <NoChatSelected />
                )}
            </div>


            {/* Mobile Chat Area */}
            {isHydrated && showChatOnMobile && (
                <div className='flex-1 w-full h-dvh min-w-0 min-h-0 overflow-hidden md:hidden'>
                    <ChatContainer />
                </div>
            )}

            <UserProfile />


        </div >
    )
}

export default HomePage
