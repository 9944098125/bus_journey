import { api as globalApi } from 'app/slice/index';
import { dashboardApi } from 'app/pages/Dashboard/slice';
import { operatorsApi } from 'app/pages/Operators/slice';
import { api as busesApi } from 'app/pages/Buses/slice';
import { api as routesApi } from 'app/pages/Routes/slice';
import { api as journeysApi } from 'app/pages/Journeys/slice';

export const rtkQueryMiddleware = [
  globalApi.middleware,
  dashboardApi.middleware,
  operatorsApi.middleware,
  busesApi.middleware,
  routesApi.middleware,
  journeysApi.middleware,
];
