import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LayoutDashboard } from 'lucide-react';

export function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Bus Journey Admin Dashboard" />
      </Helmet>
      <div className="admin-card-surface flex min-h-[50vh] flex-col items-center justify-center rounded-2xl p-10 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sea-mid to-sea-bright shadow-lg shadow-sea-mid/25">
          <LayoutDashboard
            className="size-8 text-white"
            strokeWidth={1.5}
          />
        </div>
        <h1 className="bg-gradient-to-r from-sea-deep to-sea-mid bg-clip-text text-3xl font-bold text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 max-w-md text-sea-mid/85">
          Welcome to the Bus Journey operations console.
        </p>
      </div>
    </>
  );
}
