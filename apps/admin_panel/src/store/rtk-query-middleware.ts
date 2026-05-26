import { api as globalApi } from 'app/slice/index';
import { dashboardApi } from 'app/pages/Dashboard/slice';

export const rtkQueryMiddleware = [
  globalApi.middleware,
  dashboardApi.middleware,
];
