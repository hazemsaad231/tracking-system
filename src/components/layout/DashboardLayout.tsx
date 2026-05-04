import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatWidget from '@/pages/chat/Chats';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className='z-50'>
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
      {/* Floating Chat Widget — visible to all authenticated users */}
      <ChatWidget />
    </div>
  );
};

export default DashboardLayout;
