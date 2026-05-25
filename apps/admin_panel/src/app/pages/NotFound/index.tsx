import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Anchor } from 'lucide-react';

export function NotFound() {
  return (
    <React.Fragment>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-[#90e0ef]/60 bg-white/70 p-10 text-center shadow-lg shadow-[#0077b6]/10">
        <Anchor className="mb-4 size-12 text-[#0077b6]" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-[#023047]">Page not found</h1>
        <p className="mt-2 max-w-md text-[#0077b6]/80">
          The admin route you requested does not exist or has been moved.
        </p>
        <Link
          to="/login"
          className="mt-6 rounded-xl bg-gradient-to-r from-[#023047] to-[#0077b6] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
        >
          Back to login
        </Link>
      </div>
    </React.Fragment>
  );
}
