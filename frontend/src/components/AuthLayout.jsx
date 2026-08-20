import React from 'react'

const AuthLayout = ({ children }) => {
    return (
        <div className='min-h-screen bg-black text-white flex items-center justify-center px-4'>
            {children}
        </div>
    )
}

export default AuthLayout
