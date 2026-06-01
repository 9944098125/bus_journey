import { api as globalApi } from 'app/slice/index';
import { dashboardApi } from 'app/pages/Dashboard/slice';
import { operatorsApi } from 'app/pages/Operators/slice';
import { api as busesApi } from 'app/pages/Buses/slice';
import { api as routesApi } from 'app/pages/Routes/slice';

export const rtkQueryMiddleware = [
  globalApi.middleware,
  dashboardApi.middleware,
  operatorsApi.middleware,
  busesApi.middleware,
  routesApi.middleware,
];
