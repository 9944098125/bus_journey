import type { AuthUser } from 'types/user';

/* --- STATE --- */
export interface GlobalState {
  user: AuthUser | null;
  token: string | null;
}
