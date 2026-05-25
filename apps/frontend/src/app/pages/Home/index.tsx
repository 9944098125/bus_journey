import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Bus } from 'lucide-react';

export function Home() {
  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Bus Journey — plan and book your trip" />
      </Helmet>
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-plum-600/10 bg-white/60 p-10 text-center shadow-lg shadow-plum-600/5 backdrop-blur-sm">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-plum-700 to-plum-500 shadow-lg shadow-plum-600/25">
          <Bus className="size-8 text-white" strokeWidth={1.5} aria-hidden />
        </div>
        <h1 className="bg-gradient-to-r from-plum-900 via-plum-700 to-plum-600 bg-clip-text text-3xl font-bold text-transparent">
          Welcome to Bus Journey
        </h1>
        <p className="mt-2 max-w-md text-plum-700/75">
          Search routes, book seats, and track your bus — all from the sidebar.
        </p>
      </div>
    </>
  );
}
