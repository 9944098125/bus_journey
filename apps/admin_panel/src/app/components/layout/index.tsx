import React from 'react';
import { Outlet } from 'react-router-dom';

import { useGlobalSlice } from 'app/slice';

import AdminHeader from './components/admin-header';
import AdminStatusBar from './components/admin-status-bar';
import { Sidebar } from './sidebar';
import { SidebarProvider } from './sidebar-context';

const Layout = () => {
  useGlobalSlice();

  return (
    <SidebarProvider>
      <div className="admin-wave-bg flex min-h-screen flex-col">
        <AdminHeader />
        <div className="flex min-h-0 flex-1 pt-[64px]">
          <Sidebar />
          <main
            id="admin-main"
            className="min-h-[calc(100vh-64px-36px)] min-w-0 flex-1 overflow-auto p-4 shadow-[inset_0_0_56px_-32px_rgba(2,48,71,0.14)] sm:p-6 lg:p-8"
          >
            <Outlet />
          </main>
        </div>
        <AdminStatusBar />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
