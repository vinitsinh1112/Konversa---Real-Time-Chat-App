import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position='top-center'
      toastOptions={{
        duration: 3000,

        style: {
          background: '#09090b',
          color: '#fff',
          border: "1px solid #3f3f46",
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.35)'
        },

        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#ffffff'
          },
        },

        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff'
          },
        },

      }}
    />
  </BrowserRouter>,
)
