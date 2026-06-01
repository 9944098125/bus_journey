import { GlobalState } from 'app/slice/types';
import type { DashboardState } from 'app/pages/Dashboard/slice/types';
import type { OperatorsState } from 'app/pages/Operators/slice/types';
import type { RoutesState } from 'app/pages/Routes/slice/types';

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
  /** Operators RTK Query cache (injected via useOperatorsSlice) */
  operatorsApi?: any;
  operators?: OperatorsState;
  /** Routes RTK Query cache (injected via useRoutesSlice) */
  routesApi?: any;
  routes?: RoutesState;
}
