import React from 'react'

const NoChatSelected = () => {
    return (
        <div className='flex-1 flex items-center justify-center bg-zinc-950'>
            <div className='text-center'>
                <div className='w-20 h-20 mx-auto rounded-2xl bg-white text-black flex items-center justify-center text-4xl font-bold'>
                    K
                </div>

                <h1 className='text-3xl font-bold text-white mt-5'>Welcome to Konversa,</h1>

                {/* <p className='text-zinc-400 mt-3 max-w-sm'>A good sentence for the app</p> */}

                <p className='text-zinc-500 text-md mt-3'>Select a chat to start messaging</p>

            </div>
        </div>
    )
}

export default NoChatSelected
