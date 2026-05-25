import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';

export function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-plum-600/10 bg-white/60 p-10 text-center shadow-lg shadow-plum-600/5 backdrop-blur-sm">
        <MapPinOff
          className="mb-4 size-12 text-plum-600"
          strokeWidth={1.5}
          aria-hidden
        />
        <h1 className="bg-gradient-to-r from-plum-900 via-plum-700 to-plum-600 bg-clip-text text-3xl font-bold text-transparent">
          Page not found
        </h1>
        <p className="mt-2 max-w-md text-plum-700/75">
          This destination is not on the map yet. Pick another route from the
          sidebar or head back home.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-xl bg-gradient-to-r from-plum-800 to-plum-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
        >
          Back to home
        </Link>
      </div>
    </>
  );
}
