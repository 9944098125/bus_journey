import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from 'app/slice/selectors';
import { cn } from 'utils/twm';
import {
  getUserDisplayName,
  getUserInitials,
  getUserProfilePicture,
} from 'utils/userDisplay';

export default function UserAvatar() {
  const user = useSelector(selectUser);

  if (!user) {
    return null;
  }

  const profilePicture = getUserProfilePicture(user);
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-3 rounded-2xl border-2 border-rose-100/50 bg-white/10 px-2 py-1.5',
        'shadow-lg shadow-[#3d0818]/25 backdrop-blur-sm',
      )}
      aria-label={`Logged in as ${displayName}`}
    >
      <div
        className={cn(
          'relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl',
          'border-2 border-rose-100/40 bg-[#fdf5f5] shadow-inner',
        )}
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={displayName}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-xl font-bold tracking-tight text-[#722f37]">
            {initials}
          </span>
        )}
      </div>

      <p className="min-w-0 max-w-[8rem] truncate text-sm font-semibold text-rose-50 sm:max-w-[12rem] sm:text-base lg:max-w-[14rem] lg:text-lg">
        {displayName}
      </p>
    </div>
  );
}
