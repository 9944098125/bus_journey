import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { toast } from 'app/components/ui/use-toast';
import type { FullDashboardData } from 'types/dashboard';
import { getErrorMessage } from 'utils/errors';

import { dashboardInitialState } from '../slice/selectors';
import { selectDashboardQueryParams, useDashboardSlice } from '../slice';
import { DASHBOARD_INITIAL_SKELETON_MS } from '../utils/dashboard-layout';

export { useDashboardLimits } from '../slice';

/** Default query params for GET /api/admin/dashboard (matches backend defaults). */
export const DASHBOARD_QUERY_PARAMS = dashboardInitialState;

/** Reads full dashboard payload from the RTK Query cache (same subscription as useDashboard). */
export function useDashboardData(): FullDashboardData {
  const { useGetFullDashboardQuery } = useDashboardSlice();
  const params = useSelector(selectDashboardQueryParams);
  const { data } = useGetFullDashboardQuery(params);

  if (!data?.data) {
    throw new Error('Dashboard data is not available');
  }

  return data.data;
}

/** Keeps skeleton visible for at least `DASHBOARD_INITIAL_SKELETON_MS` while the first fetch runs. */
function useInitialSkeletonHold(
  isLoading: boolean,
  isError: boolean,
  hasData: boolean,
) {
  const loadStartedAt = useRef<number | null>(null);
  const [holdSkeleton, setHoldSkeleton] = useState(true);

  useEffect(() => {
    if (isLoading) {
      loadStartedAt.current ??= Date.now();
      setHoldSkeleton(true);
      return;
    }

    if (isError) {
      setHoldSkeleton(false);
      return;
    }

    if (!hasData) {
      return;
    }

    const started = loadStartedAt.current;
    if (started === null) {
      setHoldSkeleton(false);
      return;
    }

    const remaining = Math.max(
      0,
      DASHBOARD_INITIAL_SKELETON_MS - (Date.now() - started),
    );
    const timer = window.setTimeout(() => setHoldSkeleton(false), remaining);

    return () => window.clearTimeout(timer);
  }, [isLoading, isError, hasData]);

  return holdSkeleton;
}

/** Loads the admin dashboard via GET /api/admin/dashboard. */
export function useDashboard() {
  const { useGetFullDashboardQuery } = useDashboardSlice();
  const params = useSelector(selectDashboardQueryParams);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetFullDashboardQuery(params);

  const hasData = Boolean(data?.data);
  const holdSkeleton = useInitialSkeletonHold(isLoading, isError, hasData);
  const showSkeleton = isLoading || holdSkeleton;

  useEffect(() => {
    if (!isError || !error) {
      return;
    }

    toast({
      variant: 'error',
      title: 'Could not load dashboard',
      description: getErrorMessage(
        error,
        'Failed to fetch dashboard data. Please try again.',
      ),
    });
  }, [isError, error]);

  return {
    dashboard: data?.data,
    isLoading,
    isFetching,
    isError,
    refetch,
    showSkeleton,
  };
}
