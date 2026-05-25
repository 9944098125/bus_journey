import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Route } from 'lucide-react';
import { motion } from 'framer-motion';

import { useSidebar } from 'app/components/layout/sidebar-context';
import { selectUser } from 'app/slice/selectors';
import { cn } from 'utils/twm';
import { useMediaQuery } from 'utils/hooks/use-media-query';
import {
  SIDEBAR_DESKTOP_BREAKPOINT,
  SIDEBAR_NAV_ID,
} from 'app/components/layout/sidebar/sidebar.constants';

import UserAvatar from './user-avatar';

const Navbar = () => {
  const user = useSelector(selectUser);
  const { pathname } = useLocation();
  const { toggleMobile, isMobileOpen } = useSidebar();
  const isLargeScreen = useMediaQuery(SIDEBAR_DESKTOP_BREAKPOINT);
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[70px] overflow-hidden">
      <div className="journey-navbar-glass absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,rgba(184,58,130,0.28),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_20%,rgba(212,165,116,0.16),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-plum-300/40 to-transparent" />

      <div className="relative flex h-full items-center justify-between gap-4 px-4 py-2 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {!isLargeScreen && !isAuthPage && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggleMobile}
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-2xl lg:hidden',
                'border border-white/20 bg-white/10 text-white backdrop-blur-md',
                'shadow-[0_4px_20px_-6px_rgba(95,15,64,0.45)]',
                'hover:border-plum-300/45 hover:bg-white/18',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-300/55',
              )}
              aria-label="Open navigation menu"
              aria-expanded={isMobileOpen}
              aria-controls={SIDEBAR_NAV_ID}
            >
              <Menu size={22} strokeWidth={2.25} aria-hidden />
            </motion.button>
          )}

          <Link
            to="/"
            className="group flex min-w-0 items-center gap-4 rounded-2xl outline-none transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-plum-300/50"
          >
            <div className="relative shrink-0">
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-plum-500/50 to-plum-300/40 blur-xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <img
                src="/logo.png"
                alt="Bus Journey Logo"
                className="relative h-14 w-14 rounded-2xl border-2 border-white/30 bg-white p-1 object-cover shadow-lg transition-all duration-300 group-hover:border-white/50 group-hover:shadow-xl"
              />
            </div>

            <div className="hidden min-w-0 flex-col sm:flex">
              <h1 className="bg-gradient-to-r from-white via-plum-100 to-plum-200 bg-clip-text font-playWrite text-[2rem] font-extrabold tracking-tight text-transparent drop-shadow-sm">
                Bus Journey
              </h1>
              <p className="flex items-center gap-1.5 text-[0.95rem] font-semibold uppercase tracking-[0.22em] text-white/75">
                <Route size={12} className="text-plum-300" aria-hidden />
                Smart Travel Platform
              </p>
            </div>
          </Link>
        </div>

        {(user || !isAuthPage) && (
          <div className="flex shrink-0 items-center gap-2">
            {!user && !isAuthPage && (
              <span className="hidden rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/15 md:inline">
                Plan · Book · Go
              </span>
            )}
            {user ? (
              <UserAvatar />
            ) : (
              <Link
                to="/login"
                className={cn(
                  'rounded-2xl border border-white/25 bg-gradient-to-r from-white/15 to-white/5 px-5 py-2.5 text-sm font-semibold text-white',
                  'shadow-md backdrop-blur-sm transition-all duration-300',
                  'hover:border-plum-300/50 hover:from-plum-500/30 hover:to-white/15',
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
