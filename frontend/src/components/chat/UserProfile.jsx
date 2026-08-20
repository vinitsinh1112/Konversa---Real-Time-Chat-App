import React, { useEffect, useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useAuthStore } from '../../store/authStore';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineFileDownload } from "react-icons/md";


const UserProfile = () => {

    const { selectedUser, isProfileOpen, setIsProfileOpen, getSharedMedia, sharedMedia, isSharedMediaLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);

    const currentImageIndex = sharedMedia.findIndex((item) => item.image === selectedImage);
    const isFirstImage = selectedImageIndex === 0;
    const isLastImage = selectedImageIndex === sharedMedia.length - 1;


    const isOnline = onlineUsers.includes(selectedUser?._id);

    useEffect(() => {
        if (selectedUser) {
            getSharedMedia(selectedUser._id);
        }
    }, [selectedUser, isProfileOpen]);

    useEffect(() => {
        if (isProfileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isProfileOpen]);


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

    if (!selectedUser) return null;

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    }

    const handleTouchEnd = (e) => {

        const endX = e.changedTouches[0].clientX;

        setTouchEndX(endX);

        const swipeDistance = touchStartX - endX;

        if (swipeDistance > 50) {
            handleNextImage();
        }

        if (swipeDistance < -50) {
            handlePreviousImage();
        }

    }


    const handlePreviousImage = () => {
        if (selectedImageIndex === null || selectedImageIndex === 0) return;

        const prevIndex = selectedImageIndex - 1;
        setSelectedImageIndex(prevIndex);
        setSelectedImage(sharedMedia[prevIndex].image);
    };

    const handleNextImage = () => {
        if (
            selectedImageIndex === null ||
            selectedImageIndex === sharedMedia.length - 1
        ) return;

        const nextIndex = selectedImageIndex + 1;
        setSelectedImageIndex(nextIndex);
        setSelectedImage(sharedMedia[nextIndex].image);
    };


    return (
        <>
            <div
                className={`fixed top-0 right-0 h-dvh w-full sm:w-90 lg:w-110 bg-zinc-950 border-l border-zinc-700
            z-50 transition-transform duration-200 ease-in-out flex flex-col 
            ${isProfileOpen
                        ? "translate-x-0"
                        : "translate-x-full"}
            `}
            >

                <div className='flex items-center p-4 border-b border-zinc-700'>
                    <button onClick={() => setIsProfileOpen(false)} className='p-2 text-zinc-200 rounded-full hover:bg-zinc-800 cursor-pointer transition'><FaArrowLeftLong /></button>
                </div>

                <div className='flex-1 overflow-y-scroll overscroll-contain'>
                    <div className='flex flex-col items-center px-6 py-5 md:p-8 w-full'>
                        {selectedUser.profilePic ? (
                            <img
                                src={selectedUser.profilePic}
                                alt={selectedUser.fullName}
                                className='w-28 h-28 md:w-28 md:h-28 rounded-full object-cover'
                            />
                        ) : (
                            <div className='w-28 h-28 md:w-28 md:h-28 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold'>
                                {selectedUser.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <h2 className='text-2xl md:text-2xl font-bold text-white mt-3 text-center wrap-break-word px-4'>{selectedUser.fullName}</h2>

                        <div className='flex items-center justify-center gap-2 '>
                            {isOnline ? (
                                <>
                                    <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                    <p className='text-md text-zinc-400'>Online</p>
                                </>
                            ) : (
                                <p className='text-md text-zinc-400'>Offline</p>
                            )}
                        </div>
                    </div>

                    <div className='w-full border-t border-zinc-700 p-4'>
                        <h3 className='text-xs uppercase tracking-wider text-zinc-500 mb-2'>Account Information</h3>

                        <p className='text-zinc-500 text-sm'>Username</p>
                        <p className='text-zinc-200 text-sm mb-3'>Coming soon...</p>

                        <p className='text-zinc-500 text-sm'>Email</p>
                        <p className='text-zinc-200 break-all'>{selectedUser.email}</p>
                    </div>

                    <div className='w-full border-t border-zinc-700 p-4'>
                        <h3 className='text-xs uppercase tracking-wider text-zinc-500 mb-1'>About</h3>

                        <p className='text-zinc-200'>{selectedUser.bio || "No Bio Added"}</p>
                    </div>

                    <div className='border-t border-zinc-700 p-4'>
                        <h3 className='font-semibold text-zinc-300 mb-3'>Shared Media</h3>

                        {isSharedMediaLoading ? (
                            <p className='text-sm text-zinc-500'>Loading...</p>
                        ) : sharedMedia.length === 0 ? (
                            <p className='text-sm text-zinc-500'>No Shared Media</p>
                        ) : (
                            <div className='grid grid-cols-3 gap-2'>
                                {sharedMedia.map((item, index) => (
                                    <img
                                        key={item._id}
                                        src={item.image}
                                        alt='shared media'
                                        onClick={() => {
                                            setSelectedImage(item.image);
                                            setSelectedImageIndex(index);
                                        }}
                                        className='w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition'
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>

            {selectedImage && (
                <div
                    className='fixed inset-0 bg-black/90 flex items-center justify-center z-50'
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

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePreviousImage();
                        }}
                        disabled={isFirstImage}
                        className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-4 lg:left-10 w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 items-center justify-center rounded-full transition-all duration-200
                                ${isFirstImage
                                ? "bg-black/20 text-gray-500 cursor-not-allowed opacity-50"
                                : "bg-black/30 text-white hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
                            }`}
                    >
                        <FaChevronLeft className="text-lg sm:text-xl md:text-2xl" />
                    </button>


                    <img
                        src={selectedImage}
                        alt=''
                        className='max-w-[85vw] md:max-w-[80vw] lg:max-w-[60vw] max-h-[85vh] object-contain rounded-lg image-open'
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage();
                        }}
                        disabled={isLastImage}
                        className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 md:right-4 lg:right-10 w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 items-center justify-center rounded-full transition-all duration-200
                        ${isLastImage
                                ? "bg-black/20 text-gray-500 cursor-not-allowed opacity-50"
                                : "bg-black/30 text-white hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
                            }`}
                    >
                        <FaChevronRight className="text-lg sm:text-xl md:text-2xl" />
                    </button>


                    <p className='absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-sm'>
                        {currentImageIndex + 1}/{sharedMedia.length}
                    </p>
                </div>
            )}

        </>

    )
}

export default UserProfile
