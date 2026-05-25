import type { AuthUser } from 'types/user';

const USER_KEY = 'asp-admin-user';
const TOKEN_KEY = 'asp-admin-token';

export type StoredAuth = {
  user: AuthUser | null;
  token: string | null;
};

export const hasStoredAuth = (): boolean => {
  const { user, token } = loadAuthFromStorage();
  return Boolean(user && token);
};

export const loadAuthFromStorage = (): StoredAuth => {
  const localUser = localStorage.getItem(USER_KEY);
  const localToken = localStorage.getItem(TOKEN_KEY);

  if (localUser || localToken) {
    return {
      user: localUser ? JSON.parse(localUser) : null,
      token: localToken,
    };
  }

  const sessionUser = sessionStorage.getItem(USER_KEY);
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);

  return {
    user: sessionUser ? JSON.parse(sessionUser) : null,
    token: sessionToken,
  };
};

export const persistAuthToStorage = (
  user: AuthUser | null,
  token: string | null,
  rememberMe: boolean,
) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  otherStorage.removeItem(USER_KEY);
  otherStorage.removeItem(TOKEN_KEY);

  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    storage.removeItem(USER_KEY);
  }

  if (token) {
    storage.setItem(TOKEN_KEY, token);
  } else {
    storage.removeItem(TOKEN_KEY);
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};
