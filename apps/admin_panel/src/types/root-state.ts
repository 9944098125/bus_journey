import { GlobalState } from 'app/slice/types';
import type { DashboardState } from 'app/pages/Dashboard/slice/types';

/*
  Because redux-injectors registers reducers asynchronously, declare keys here manually.
  Keys marked optional are injected when their feature route mounts.
*/
export interface RootState {
  /** Auth + login RTK Query cache (always registered in core reducers) */
  globalApi: any;
  global?: GlobalState;
  /** Admin dashboard RTK Query cache (injected via useDashboardSlice) */
  dashboardApi?: any;
  dashboard?: DashboardState;
}
