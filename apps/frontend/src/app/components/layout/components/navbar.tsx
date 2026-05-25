import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

import { useSidebar } from 'app/components/layout/sidebar-context';
import { selectUser } from 'app/slice/selectors';
import { cn } from 'utils/twm';
import { useMediaQuery } from 'utils/hooks/use-media-query';
import { SIDEBAR_DESKTOP_BREAKPOINT } from 'app/components/layout/sidebar/sidebar.constants';

import UserAvatar from './user-avatar';

const Navbar = () => {
  const user = useSelector(selectUser);
  const { pathname } = useLocation();
  const { toggleMobile } = useSidebar();
  const isLargeScreen = useMediaQuery(SIDEBAR_DESKTOP_BREAKPOINT);
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[70px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#3d0818] via-[#722F37] to-[#8B2635]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(212,175,55,0.2),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_15%,rgba(255,255,255,0.1),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/40 to-transparent" />

      <div className="relative flex h-full items-center justify-between gap-4 px-4 py-2 backdrop-blur-sm md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {!isLargeScreen && !isAuthPage && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={toggleMobile}
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-2xl lg:hidden',
                'border border-rose-100/30 bg-white/10 text-rose-50 backdrop-blur-md',
                'hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/70',
              )}
              aria-label="Open navigation menu"
              aria-controls="travel-sidebar-nav"
            >
              <Menu size={22} strokeWidth={2.25} aria-hidden />
            </motion.button>
          )}

        <div className="group flex min-w-0 cursor-default items-center gap-4 rounded-2xl transition-transform duration-300 hover:scale-[1.02]">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-amber-400/35 blur-xl transition-all duration-500 group-hover:bg-amber-300/45 group-hover:blur-2xl" />

            <img
              src="/logo.png"
              alt="Bus Journey Logo"
              className="relative h-14 w-14 rounded-2xl border-2 border-rose-100/40 bg-white p-1 object-cover shadow-lg shadow-[#3d0818]/40 transition-all duration-300 group-hover:border-rose-50/60 group-hover:shadow-xl group-hover:shadow-amber-400/20"
            />
          </div>

          <div className="hidden min-w-0 flex-col sm:flex">
            <h1 className="bg-gradient-to-r from-rose-100 via-amber-200 to-amber-300 bg-clip-text font-playWrite text-[2rem] font-extrabold tracking-tight text-transparent drop-shadow-sm transition-all duration-300 group-hover:from-white group-hover:via-amber-100 group-hover:to-amber-200">
              Bus Journey
            </h1>

            <p className="text-[1rem] font-semibold uppercase tracking-[0.25em] text-rose-100/90 transition-colors duration-300 group-hover:text-rose-50">
              Smart Travel Platform
            </p>
          </div>
        </div>
        </div>

        {(user || !isAuthPage) && (
          <div className="flex shrink-0 items-center">
            {user ? (
              <UserAvatar />
            ) : (
              <Link
                to="/login"
                className={cn(
                  'rounded-xl border-2 border-rose-100/50 bg-white/10 px-4 py-2.5 text-sm font-semibold text-rose-50',
                  'shadow-md shadow-[#3d0818]/20 backdrop-blur-sm transition-all duration-300',
                  'hover:border-amber-200/70 hover:bg-white/15 hover:text-white',
                )}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
