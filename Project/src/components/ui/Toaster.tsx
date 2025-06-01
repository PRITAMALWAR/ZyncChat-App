import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const toastQueue: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

export function toast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { id, message, type };
  
  toastQueue.push(newToast);
  listeners.forEach(listener => listener([...toastQueue]));
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const index = toastQueue.findIndex(t => t.id === id);
    if (index !== -1) {
      toastQueue.splice(index, 1);
      listeners.forEach(listener => listener([...toastQueue]));
    }
  }, 5000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  useEffect(() => {
    // Add listener
    const listener = (updatedToasts: Toast[]) => {
      setToasts(updatedToasts);
    };
    
    listeners.push(listener);
    setToasts([...toastQueue]);
    
    return () => {
      // Remove listener
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  const removeToast = (id: string) => {
    const index = toastQueue.findIndex(t => t.id === id);
    if (index !== -1) {
      toastQueue.splice(index, 1);
      setToasts([...toastQueue]);
    }
  };
  
  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getToastColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };
  
  if (toasts.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-md border flex items-start w-80 transform transition-all duration-300 ${getToastColor(toast.type)}`}
          style={{ 
            animation: 'slideIn 0.3s ease forwards, fadeOut 0.3s ease 4.7s forwards' 
          }}
        >
          <div className="flex-shrink-0 mr-3">
            {getToastIcon(toast.type)}
          </div>
          <div className="flex-1 mr-2">
            <p className="text-sm text-gray-800 dark:text-gray-100">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}