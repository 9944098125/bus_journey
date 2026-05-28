import { lazyLoad } from 'utils/loadable';

export const OperatorDetails = lazyLoad(
  () => import('./index'),
  module => module.OperatorDetails,
);
