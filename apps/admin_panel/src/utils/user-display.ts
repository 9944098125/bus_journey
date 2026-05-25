import type { AuthUser } from 'types/user';

type UserLike = AuthUser | null | undefined;

export const getUserProfilePicture = (user: UserLike): string | undefined => {
  const picture = user?.profile_picture;

  if (typeof picture === 'string' && picture.trim()) {
    return picture;
  }

  return undefined;
};

export const getUserDisplayName = (user: UserLike): string => {
  const name = user?.full_name;

  if (typeof name === 'string' && name.trim()) {
    return name.trim();
  }

  return 'Admin';
};

export const getUserInitials = (user: UserLike): string => {
  const parts = getUserDisplayName(user).split(/\s+/).filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('') || 'A'
  );
};
