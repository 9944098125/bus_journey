import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from 'app/components/ui/button';

import { DashboardSkeleton } from './dashboard-skeleton';

type DashboardLoadingProps = {
  label?: string;
};

export function DashboardLoading(props: DashboardLoadingProps) {
  return <DashboardSkeleton {...props} />;
}

type DashboardErrorProps = {
  message?: string;
  onRetry: () => void;
};

export function DashboardError({ message, onRetry }: DashboardErrorProps) {
  return (
    <div className="admin-card-surface flex flex-col items-center justify-center rounded-2xl border p-12 text-center">
      <AlertCircle className="mb-4 size-12 text-amber-500" aria-hidden />
      <h2 className="text-[1.8rem] font-bold text-sea-deep">
        Dashboard unavailable
      </h2>
      <p className="mt-2 max-w-md text-[1.3rem] text-sea-mid/75">
        {message ||
          'We could not load dashboard data. Check that you are signed in as an admin.'}
      </p>
      <Button
        type="button"
        variant="primary"
        className="mt-6 h-12 px-6"
        onClick={onRetry}
      >
        <RefreshCw className="mr-2 size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}
