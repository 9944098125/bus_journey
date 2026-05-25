import React from 'react';
import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import { useGlobalSlice } from 'app/slice';
import { SidebarProvider } from 'app/components/layout/sidebar-context';
import { Sidebar } from 'app/components/layout/sidebar';

import Navbar from './components/navbar';

const Layout = () => {
  useGlobalSlice();
  const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <div className="travel-app-bg min-h-screen">
        <Navbar />

        <div className="flex pt-[70px]">
          <Sidebar />

          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[calc(100vh-70px)] min-w-0 flex-1 p-3 sm:p-4 md:p-6 lg:p-8"
          >
            <div className="travel-main-surface min-h-full rounded-2xl p-4 sm:p-6 md:p-8">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
