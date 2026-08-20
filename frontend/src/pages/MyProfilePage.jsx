import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { FaArrowLeftLong } from 'react-icons/fa6';
import { MdEdit } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import toast from 'react-hot-toast';

const MyProfilePage = () => {

    const { authUser, updateProfile, isLoading } = useAuthStore();

    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);


    useEffect(() => {
        if (authUser) {
            setFullName(authUser.fullName || "");
            setBio(authUser.bio || "");
        }
    }, [authUser]);


    const handleSave = async () => {

        const formData = new FormData();

        formData.append("fullName", fullName);
        formData.append("bio", bio);

        if (image) {
            formData.append("profilePic", image);
        }

        await updateProfile(formData);
        toast.success("Profile updated");

        setImage(null);
        setIsEditing(false);
    }

    if (!authUser) {
        return (
            <div className='min-h-screen bg-black text-white flex items-center justify-center'>
                Loading...
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-black text-white p-5'>
            <div className='max-w-2xl mx-auto'>
                <div className='bg-zinc-900 rounded-2xl p-5'>

                    <div className='flex items-center justify-between mb-6'>
                        <button onClick={() => window.history.back()} className='text-zinc-400 rounded-full cursor-pointer transition'><FaArrowLeftLong size={18} /></button>

                        <h1 className='text-xl font-semibold'>My Profile</h1>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className='px-2 py-2 flex items-center justify-center rounded-full hover:bg-zinc-700 cursor-pointer transition'
                        >
                            {isEditing ? <IoMdCloseCircle size={20} /> : <MdEdit size={20} />}
                        </button>
                    </div>

                    <div className='flex flex-col items-center'>
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt='preview'
                                className='w-28 h-28 rounded-full object-cover bg-white'
                            />
                        ) : authUser?.profilePic ? (
                            <img
                                src={authUser?.profilePic}
                                alt={authUser?.fullName}
                                className='w-28 h-28 rounded-full object-contain bg-white'
                            />
                        ) : (
                            <div className='w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-5xl font-bold'>
                                {authUser.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {
                            isEditing && (
                                <label className='mt-3 cursor-pointer text-sm text-blue-500 hover:text-blue-600'>
                                    Change Profile Picture

                                    <input
                                        type='file'
                                        accept='image/*'
                                        className='hidden'
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </label>
                            )
                        }

                        <h1 className='text-2xl font-bold mt-4'>{authUser?.fullName}</h1>

                        <p className='text-zinc-400'>{authUser?.email}</p>

                    </div>

                    <div className='mt-8'>
                        <h2 className='text-lg font-semibold'>Account Information</h2>

                        <div className='mt-4 space-y-3'>
                            <div>
                                <p className='text-zinc-500 text-sm'>Full Name</p>
                                {isEditing ? (
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className='w-full mt-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none'
                                    />
                                ) : (
                                    <p>{authUser?.fullName}</p>
                                )}
                            </div>

                            <div>
                                <p className='text-zinc-500 text-sm'>Email</p>
                                <p>{authUser?.email}</p>
                            </div>

                            <div>
                                <p className='text-zinc-500 text-sm'>Bio</p>
                                {isEditing ? (
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={4}
                                        className='w-full mt-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none'
                                    />
                                ) : (
                                    <p>{authUser?.bio || "No Bio Added"}</p>
                                )}
                            </div>

                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className='w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition cursor-pointer'
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </button>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MyProfilePage
