import React from 'react'
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from '../../store/chatStore';

const EmojiDrawer = () => {

    const { showEmojiPicker, setMessageText } = useChatStore();

    const handleEmoji = (emojiData) => {
        const currentText = useChatStore.getState().messageText;
        setMessageText(currentText + emojiData.emoji);
    };


    return (
        <div className={`overflow-hidden shrink-0 transition-all duration-250 ease-[cubic-beizer(0.22,1,0.36,1)] ${showEmojiPicker ? "h-[40vh]" : "h-0"}`}>
            <div className={`h-[40vh] transition-transform duration-250 ease-[cubic-beizer(0.22,1,0.36,1)] ${showEmojiPicker ? "translate-y-0" : "translate-y-full"}`}>
                <EmojiPicker
                    theme='dark'
                    height="100%"
                    width="100%"
                    previewConfig={{ showPreview: false }}
                    onEmojiClick={handleEmoji}
                    searchDisabled={true}
                />
            </div>
        </div>
    )
}

export default EmojiDrawer
