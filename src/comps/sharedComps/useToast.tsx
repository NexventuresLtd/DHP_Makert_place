import { useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({ message: '', type: 'info', visible: false });

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const ToastComponent = () => {
    if (!toast.visible) return null;

    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
    }[toast.type];

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div
          className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}
        >
          <span>{toast.message}</span>
        </div>
      </div>
    );
  };

  return { showToast, ToastComponent };
};