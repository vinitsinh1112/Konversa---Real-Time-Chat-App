import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { authUser, isCheckingAuth } = useAuthStore();

    // 🔥 IMPORTANT: wait until auth is known
    if (isCheckingAuth) {
        return (
            <div className="h-screen flex items-center bg-black justify-center">
                <div className="animate-pulse text-zinc-200">
                    Loading...
                </div>
            </div>
        );
    }

    if (!authUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;