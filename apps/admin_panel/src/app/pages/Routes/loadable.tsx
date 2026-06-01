import { lazyLoad } from 'utils/loadable';

export const Routes = lazyLoad(
  () => import('./index'),
  module => module.Routes,
);
