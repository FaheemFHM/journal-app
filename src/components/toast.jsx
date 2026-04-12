
import {
  createContext,
  useContext,
  useState,
  useCallback
} from "react";

import "./toast.css";

const ToastContext = createContext();
const maxToasts = 3;

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message) => {
    const id = Date.now();

    setToasts(prev => {
      const updated = [...prev, { id, message }];
      return updated.slice(-maxToasts);
    });

    const timeout = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} />
      ))}
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="toast">
      {message}
    </div>
  );
}
