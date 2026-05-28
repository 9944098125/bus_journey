import { lazyLoad } from 'utils/loadable';

export const Buses = lazyLoad(
  () => import('./index'),
  module => module.Buses,
);
