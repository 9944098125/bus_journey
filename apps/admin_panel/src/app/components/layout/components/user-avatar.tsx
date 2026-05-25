import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from 'app/slice/selectors';
import { cn } from 'utils/twm';
import {
  getUserDisplayName,
  getUserInitials,
  getUserProfilePicture,
} from 'utils/user-display';

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
        'flex min-w-0 items-center gap-3 rounded-2xl border-2 border-[#90e0ef]/50 bg-white/10 px-2.5 py-2',
        'shadow-lg shadow-[#023047]/25 backdrop-blur-sm',
      )}
      aria-label={`Logged in as ${displayName}`}
    >
      <div
        className={cn(
          'relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl',
          'border-2 border-[#90e0ef]/40 bg-[#e8f6fc] shadow-inner',
        )}
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={displayName}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold tracking-tight text-[#0077b6]">
            {initials}
          </span>
        )}
      </div>

      <p className="min-w-0 max-w-[8rem] truncate text-sm font-semibold text-[#caf0f8] sm:max-w-[12rem] sm:text-base lg:max-w-[14rem] lg:text-lg">
        {displayName}
      </p>
    </div>
  );
}
