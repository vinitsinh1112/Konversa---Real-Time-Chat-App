import React, { useEffect, useRef, useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { MdOutlineImage, MdOutlineEmojiEmotions } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { } from "react-icons/md";



const MessageInput = () => {

    const [image, setImage] = useState(null);

    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const emojiButtonRef = useRef(null);

    const { selectedUser, sendMessage, addTempMessage, showEmojiPicker, setShowEmojiPicker, messageText, setMessageText } = useChatStore();
    const { socket, authUser } = useAuthStore();



    const handleSendMessage = async () => {

        if (!messageText.trim() && !image) return;

        const previewUrl = image ? URL.createObjectURL(image) : "";
        const tempId = Date.now();

        const tempMessage = {
            _id: `temp-${Date.now()}`,
            tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageText,
            image: previewUrl,
            seen: false,
            uploading: true,
            createdAt: new Date(),
        };

        const formData = new FormData();

        formData.append("text", messageText);

        if (image) {
            formData.append("image", image);
        }

        setMessageText("");
        setImage(null);
        setShowEmojiPicker(false);

        addTempMessage(tempMessage);
        await sendMessage(selectedUser._id, formData, tempId);

        socket?.emit("stopTyping", {
            receiverId: selectedUser._id
        });

    }

    return (
        <div className='relative shrink-0 w-full p-4 sm:p-4 border-t border-zinc-700'>
            {image && (
                <div className='mb-3 relative inline-block'>
                    <img
                        src={URL.createObjectURL(image)}
                        alt='preview'
                        className='w-28 h-28 rounded-xl object-cover border border-zinc-700'
                    />

                    <button
                        onClick={() => setImage(null)}
                        className='absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white cursor-pointer'
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            )}
            <div className='flex items-center gap-2 md:gap-3 w-full'>
                <input
                    type='file'
                    accept='image/*'
                    ref={fileInputRef}
                    className='hidden'
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setImage(file);
                        }
                    }}
                />

                <button
                    onClick={() => fileInputRef.current.click()}
                    className={`p-2 sm:p-3 rounded-full transition cursor-pointer ${image ? "bg-green-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"} `}
                >
                    <MdOutlineImage size={20} />
                </button>

                <div className='flex-1 relative'>

                    <input
                        type='text'
                        placeholder='Type a message...'
                        value={messageText}
                        onChange={(e) => {

                            setMessageText(e.target.value);

                            socket?.emit("typing", {
                                receiverId: selectedUser._id
                            });

                            clearTimeout(typingTimeoutRef.current);

                            typingTimeoutRef.current = setTimeout(() => {

                                socket?.emit("stopTyping", {
                                    receiverId: selectedUser._id
                                });

                            }, 1000);

                        }}
                        className='w-full bg-zinc-800 rounded-xl pl-4 pr-11 py-2 outline-none text-zinc-100'
                    />

                    <button
                        ref={emojiButtonRef}
                        type='button'
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white'
                    >
                        <MdOutlineEmojiEmotions size={22} />
                    </button>

                </div>

                <button
                    onClick={handleSendMessage}
                    className='p-2 md:p-3 rounded-full cursor-pointer bg-blue-600 hover:bg-blue-700 transition'
                >
                    <IoSendSharp
                        size={20}
                        className='justify-self-center'
                    />
                </button>
            </div>
        </div>
    )

}

export default MessageInput;