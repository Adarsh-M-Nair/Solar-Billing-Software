import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header Placeholder if needed */}
        <header className="glass-header h-16 w-full flex items-center px-8 justify-between">
            <h1 className="text-sm font-medium text-slate-500">Solar Billing System</h1>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto page-container w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
