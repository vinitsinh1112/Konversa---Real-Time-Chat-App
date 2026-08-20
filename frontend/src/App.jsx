import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './routes/ProtectedRoute'
import MyProfilePage from './pages/MyProfilePage'
import { useChatStore } from './store/chatStore'

const App = () => {

  const { checkAuth, socket } = useAuthStore();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, []);


  useEffect(() => {

    if (!socket) return;

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    }

  }, [socket]);


  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<MyProfilePage />} />
    </Routes>
  );
}

export default App;