import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Shield } from 'lucide-react';

import { useSidebar } from 'app/components/layout/sidebar-context';
import { selectUser } from 'app/slice/selectors';
import { cn } from 'utils/twm';

import UserAvatar from './user-avatar';

type AdminHeaderProps = {
  minimal?: boolean;
};

const AdminHeader = ({ minimal = false }: AdminHeaderProps) => {
  const user = useSelector(selectUser);
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';
  const { toggleMobile } = useSidebar();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[64px] overflow-hidden border-b border-sea-light/40">
      <div className="absolute inset-0 bg-gradient-to-r from-sea-deep via-sea-mid to-[#0096c7]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_50%,rgba(144,224,239,0.38),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_20%,rgba(0,180,216,0.28),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(72,202,228,0.15),transparent_40%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sea-light/70 to-transparent" />

      <div className="relative flex h-full items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {!isLogin && (
            <button
              type="button"
              onClick={toggleMobile}
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-2xl lg:hidden',
                'border border-sea-light/40 bg-white/10 text-sea-pale transition-all',
                'hover:bg-white/20 hover:text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea-pale/80',
              )}
              aria-label="Open navigation menu"
            >
              <Menu size={20} strokeWidth={2} aria-hidden />
            </button>
          )}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sea-light/50 bg-white/10 shadow-lg shadow-sea-deep/30 backdrop-blur-sm">
            <Shield className="size-6 text-sea-pale" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[1.8rem] font-bold tracking-tight text-white">
              Bus Journey Admin
            </h1>
            {!minimal && (
              <p className="hidden text-[0.95rem] font-medium uppercase tracking-[0.2em] text-white sm:block">
                Operations Console
              </p>
            )}
          </div>
        </div>

        {!isLogin && (
          <div className="flex shrink-0 items-center gap-3">
            {user ? (
              <UserAvatar />
            ) : (
              <Link
                to="/login"
                className={cn(
                  'rounded-lg border border-sea-light/50 bg-white/10 px-4 py-2 text-sm font-semibold text-sea-pale',
                  'transition-all hover:border-sea-pale/70 hover:bg-white/20 hover:text-white',
                )}
              >
                Sign in
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
