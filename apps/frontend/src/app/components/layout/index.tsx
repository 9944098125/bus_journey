import React from 'react';
import { useGlobalSlice } from 'app/slice';
import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar';

const Layout = () => {
  useGlobalSlice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf5f5] via-[#faf0f0] to-[#f3e4e6]">
      <Navbar />

      <div className="flex pt-[70px]">
        <Sidebar />

        <main className="min-h-[calc(100vh-70px)] min-w-0 flex-1 bg-[#fffbfa]/50 p-3 shadow-[inset_8px_0_32px_-24px_rgba(114,47,55,0.1)] backdrop-blur-[2px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
