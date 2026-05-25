import React from 'react';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';

import { LOGIN_HERO_FEATURES } from './constants';

export function LoginHero() {
  return (
    <section className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-[#023047] via-[#0077b6] to-[#00b4d8] p-10 text-white shadow-2xl shadow-[#0077b6]/30 lg:flex lg:w-[42%] lg:shrink-0 lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-[#90e0ef]/15 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          <ShieldCheck className="size-4 text-[#90e0ef]" />
          Admin access
        </div>
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          Sign in to the operations console
        </h1>
        <p className="mt-4 max-w-sm text-base text-white/85">
          Use your staff email or phone number to manage buses, routes, and
          bookings.
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <div className="flex size-48 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm xl:size-56">
          <LayoutDashboard
            className="size-24 text-[#caf0f8] xl:size-28"
            strokeWidth={1.25}
          />
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        {LOGIN_HERO_FEATURES.map(item => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
          >
            <ShieldCheck className="size-5 shrink-0 text-[#90e0ef]" />
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
