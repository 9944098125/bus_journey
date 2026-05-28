import { lazyLoad } from 'utils/loadable';

export const Operators = lazyLoad(
  () => import('./index'),
  module => module.Operators,
);
