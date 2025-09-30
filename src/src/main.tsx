import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e5e5',
          color: '#333',
        },
      }}
    />
  </React.StrictMode>,
)