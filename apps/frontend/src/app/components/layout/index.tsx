import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';

import { useGlobalSlice } from 'app/slice';
import { SidebarProvider } from 'app/components/layout/sidebar-context';
import { Sidebar } from 'app/components/layout/sidebar';

import Navbar from './components/navbar';

function formatPageTitle(pathname: string): string {
  if (pathname === '/') return 'Home';
  const segment = pathname.split('/').filter(Boolean).pop() ?? 'home';
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

const Layout = () => {
  useGlobalSlice();
  const { pathname } = useLocation();
  const pageTitle = useMemo(() => formatPageTitle(pathname), [pathname]);

  return (
    <SidebarProvider>
      <div className="travel-app-bg min-h-screen">
        <Navbar />

        <div className="journey-layout-shell flex pt-[70px]">
          <Sidebar />

          <div className="min-w-0 flex-1">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 12, scale: 0.992 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="journey-main-frame"
            >
              <div className="journey-main-inner flex min-h-full flex-col">
                <motion.header
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06, duration: 0.28 }}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-plum-600/10 px-4 py-3 sm:px-6 md:px-8"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <motion.span
                      whileHover={{ scale: 1.06, rotate: -3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-plum-600/15 to-plum-400/20 ring-1 ring-plum-600/12"
                    >
                      <MapPin size={16} className="text-plum-700" aria-hidden />
                    </motion.span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-plum-600/50">
                        Your journey
                      </p>
                      <h2 className="truncate bg-gradient-to-r from-plum-900 via-plum-700 to-plum-600 bg-clip-text text-[1.5rem] font-bold tracking-tight text-transparent sm:text-[1.65rem]">
                        {pageTitle}
                      </h2>
                    </div>
                  </div>
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-plum-600/10 to-plum-400/12 px-3 py-1.5 text-[11px] font-semibold text-plum-700/75 ring-1 ring-plum-600/12"
                  >
                    <Sparkles size={12} className="text-plum-500" aria-hidden />
                    Live route view
                  </motion.span>
                </motion.header>

                <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
                  <Outlet />
                </div>
              </div>
            </motion.main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
