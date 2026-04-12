
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './scrollbar.css'
import App from './App.jsx'
import { ToastProvider } from "./components/toast";

import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
)
