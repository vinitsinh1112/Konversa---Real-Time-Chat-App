import React from 'react'
import ChatHeader from './ChatHeader';
import MessageContainer from './MessageContainer';
import MessageInput from './MessageInput';
import { useChatStore } from '../../store/chatStore';
import EmojiDrawer from './EmojiDrawer';


const ChatContainer = () => {

    const { isProfileOpen, showChatOnMobile } = useChatStore();


    return (
        <div className={`relative flex flex-col flex-1 w-full h-dvh min-w-0 min-h-0 bg-zinc-950 transition-all duration-200 ${isProfileOpen && !showChatOnMobile ? "lg:mr-110" : ""}`}>

            {/* Chat Header */}
            <ChatHeader />

            {/* Message Area */}
            <MessageContainer />

            {/* Message Input Section */}
            <MessageInput />

            {/* Emoji Section */}
            <EmojiDrawer />
        </div>
    )
}

export default ChatContainer
