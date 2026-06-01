import { lazyLoad } from 'utils/loadable';

export const Journeys = lazyLoad(
  () => import('./index'),
  module => module.Journeys,
);
