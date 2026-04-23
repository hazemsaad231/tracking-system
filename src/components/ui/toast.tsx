import toast from 'react-hot-toast';

export const success = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    duration: 3000,
    style: {
      background: 'rgba(30, 41, 59, 0.9)', // bg-slate-800
      color: '#ffffff',
      border: '1px solid rgba(139, 92, 246, 0.3)', // violet-500 border
      boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.15), 0 8px 10px -6px rgba(139, 92, 246, 0.1)',
      backdropFilter: 'blur(12px)',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#10b981', // emerald-500
      secondary: '#fff',
    },
  });
};

export const Error = (message: string) => {
  toast.error(message, {
    position: 'top-center',
    duration: 4000,
    style: {
      background: 'rgba(30, 41, 59, 0.9)',
      color: '#ffffff',
      border: '1px solid rgba(239, 68, 68, 0.3)', // red-500 border
      boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.15), 0 8px 10px -6px rgba(239, 68, 68, 0.1)',
      backdropFilter: 'blur(12px)',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#ef4444', // red-500
      secondary: '#fff',
    },
  });
};

export const info = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    position: 'top-center',
    style: {
      background: 'rgba(30, 41, 59, 0.9)',
      color: '#ffffff',
      border: '1px solid rgba(59, 130, 246, 0.3)', // blue-500 border
      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
      backdropFilter: 'blur(12px)',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '500',
    },
  });
};

export default toast;
