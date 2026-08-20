import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { IoCheckmark, IoCheckmarkDoneSharp, IoTimeOutline } from "react-icons/io5";
import { FaTimes } from 'react-icons/fa';
import { MdOutlineFileDownload } from "react-icons/md";
import { HiDotsVertical } from 'react-icons/hi';


const MessageContainer = () => {

    const { selectedUser, getMessages, messages, isMessagesLoading, deleteMessage } = useChatStore();
    const { authUser } = useAuthStore();




    const [loadedImages, setLoadedImages] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState(null);


    const messageRefEndRef = useRef(null);
    const firstLoadRef = useRef(true);
    const previousMessageCountRef = useRef(0);
    const longPressTimer = useRef(null);
    const longPressTriggered = useRef(false);

    useEffect(() => {
        if (!selectedUser) return;

        getMessages(selectedUser._id);

    }, [selectedUser]);

    useEffect(() => {
        setLoadedImages({});
    }, [selectedUser]);

    useEffect(() => {
        firstLoadRef.current = true;
        previousMessageCountRef.current = 0;
    }, [selectedUser]);

    useLayoutEffect(() => {

        if (!messages.length) return;

        const isInitialLoad = previousMessageCountRef.current === 0;

        messageRefEndRef.current?.scrollIntoView({
            behavior: isInitialLoad ? "auto" : "smooth"
        });

        previousMessageCountRef.current = messages.length;

    }, [messages]);



    if (isMessagesLoading) {
        return (
            <div className='flex-1 min-h-0 overflow-hidden space-y-4 flex flex-col gap-4'>
                {[...Array(8)].map((_, index) => (
                    <div key={index} className={`flex py-2 px-4 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                        <div className='w-68 h-16 rounded-xl bg-zinc-800 animate-pulse'></div>
                    </div>
                ))}
            </div>
        )
    }


    const handleDownloadImage = async () => {
        try {
            const response = await fetch(selectedImage);

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `konversa-${Date.now()}.jpg`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.log(error);
        }

    }


    const handleLongPress = (message) => {

        if (window.innerWidth >= 768) return;

        longPressTimer.current = setTimeout(() => {

            longPressTriggered.current = true;

            setMessageToDelete(message);

        }, 500);

    }


    return (
        <>
            {activeMenu && (
                <div className='fixed inset-0 z-10' onClick={() => setActiveMenu(null)}></div>
            )}

            <div className='flex-1 min-h-0 overflow-y-auto p-4'>

                {messages.map((message, index) => {

                    const isMe = message.senderId === authUser._id;

                    const previousMessage = messages[index - 1];

                    const currentDate = new Date(message.createdAt).toDateString();

                    const previousDate = previousMessage
                        ? new Date(previousMessage.createdAt).toDateString()
                        : null;

                    const showDateSeparator = currentDate !== previousDate;

                    const today = new Date().toDateString();
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    let separatorText = currentDate;

                    if (currentDate === today) {
                        separatorText = "Today";
                    } else if (currentDate === yesterday.toDateString()) {
                        separatorText = "Yesterday"
                    } else {
                        separatorText = new Date(message.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
                    }

                    return (
                        <React.Fragment key={message._id}>
                            {showDateSeparator && (
                                <div className='flex justify-center my-4'>
                                    <div className='px-2 py-1 rounded-md bg-zinc-800 text-xs text-zinc-400'>
                                        {separatorText}
                                    </div>
                                </div>
                            )}

                            <div ref={index === messages.length - 1 ? messageRefEndRef : null} className={`flex mt-2 ${isMe ? 'justify-end' : 'justify-start'}`}>

                                <div
                                    className={`group relative px-3 py-1 max-w-[75%] md:max-w-[65%] lg:max-w-[55%] ${isMe
                                        ? 'bg-blue-900 rounded-lg rounded-tr-none'
                                        : 'bg-zinc-800 rounded-lg rounded-tl-none'
                                        }`}
                                    onTouchStart={() => {
                                        if (!isMe) return;

                                        handleLongPress(message);

                                    }}

                                    onTouchEnd={() => {
                                        clearTimeout(longPressTimer.current);

                                        if (longPressTriggered.current) {
                                            longPressTriggered.current = false;
                                            return;
                                        }

                                    }}

                                    onTouchMove={() => {
                                        clearTimeout(longPressTimer.current);
                                    }}

                                    style={{
                                        WebkitTouchCallout: "none",
                                        WebkitUserSelect: "none",
                                        userSelect: "none",
                                    }}

                                >
                                    {isMe && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    setActiveMenu(
                                                        activeMenu === message._id ? null : message._id
                                                    )
                                                }}
                                                className={`absolute -left-6 top-2 transition-opacity duration-200 ${activeMenu === message._id
                                                    ? "opacity-100"
                                                    : "opacity-0 group-hover:opacity-100"
                                                    } text-zinc-400 hover:text-white cursor-pointer
                                                `}
                                            >
                                                <HiDotsVertical size={18} />
                                            </button>

                                            {activeMenu === message._id && (
                                                <div onClick={(e) => e.stopPropagation()} className="absolute top-8 -left-24 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-30 overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            setActiveMenu(null);
                                                            setMessageToDelete(message);
                                                        }}
                                                        className="block w-full px-4 py-2 text-left font-semibold text-red-400 hover:bg-zinc-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className='flex flex-col'>
                                        {message.image && (
                                            <div className='relative max-w-55 md:max-w-70 lg:max-w-85 rounded-lg overflow-hidden'>
                                                {!loadedImages[message._id] && (
                                                    <div className='w-90 max-w-55 md:max-w-70 lg:max-w-85 aspect-4/5 bg-zinc-500 animate-pulse rounded-lg'></div>
                                                )}

                                                <img
                                                    src={message.image}
                                                    alt='image'
                                                    onLoad={() => {
                                                        setLoadedImages((prev) => ({
                                                            ...prev,
                                                            [message._id]: true,
                                                        }));

                                                        setTimeout(() => {
                                                            messageRefEndRef.current?.scrollIntoView({
                                                                behavior: "auto",
                                                            });
                                                        }, 50);
                                                    }}
                                                    onClick={() => setSelectedImage(message.image)}
                                                    className={`w-80 h-auto max-h-80 object-cover cursor-pointer hover:scale-[1.02] transition my-1 ${loadedImages[message._id] ? "block" : "hidden"}`}
                                                />
                                            </div>
                                        )}

                                        {message.text && (
                                            <p className='text-white'>{message.text}</p>
                                        )}


                                        <div className='flex items-center justify-end gap-1 mt-1'>
                                            <span className='text-[10px] text-zinc-100 opacity-70'>
                                                {new Date(message.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>

                                            {isMe && (
                                                <span className='text-[14px] text-zinc-100 opacity-100'>
                                                    {message.uploading ? (
                                                        <IoTimeOutline />
                                                    ) : message.seen ? (
                                                        <IoCheckmarkDoneSharp className='text-green-500' />
                                                    ) : (
                                                        <IoCheckmark className='text-white/70' />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            {selectedImage && (
                <div
                    className='fixed inset-0 bg-black/90 flex items-center justify-center z-40'
                    onClick={() => setSelectedImage(null)}
                >

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage();
                        }}
                        className='absolute top-5 right-16 text-white text-2xl cursor-pointer hover:scale-110 transition'
                    >
                        <MdOutlineFileDownload />
                    </button>

                    <button
                        className='absolute top-5 right-5 text-white text-2xl cursor-pointer hover:scale-110 transition'
                        onClick={() => setSelectedImage(null)}
                    >
                        <FaTimes />
                    </button>
                    <img
                        src={selectedImage}
                        alt=''
                        className='max-w-[90vw] max-h-[90vh] object-contain rounded-lg  image-open'
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}


            {messageToDelete && (
                <div onClick={() => setMessageToDelete(null)} className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div onClick={(e) => e.stopPropagation()} className='bg-zinc-900 border border-zinc-700 rounded-md p-4 w-80'>

                        <h3 className='text-white font-semibold text-lg'>Delete Message</h3>

                        <p className='text-zinc-400 text-sm mt-2'>Are you sure you want to delete this message?</p>

                        <div className='flex justify-end gap-3 mt-5'>
                            <button
                                onClick={() => {
                                    setMessageToDelete(null);
                                }}
                                className='px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer transition-all duration-100'
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await deleteMessage(messageToDelete._id);
                                    setMessageToDelete(null);
                                }}
                                className='px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-all duration-100'
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

export default MessageContainer;