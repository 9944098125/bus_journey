import React from 'react';
import { Bus, Sparkles } from 'lucide-react';

import { REGISTER_HERO_FEATURES } from './constants';

export function RegisterHero() {
  return (
    <section className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-[#5c0a1a] via-[#722f37] to-[#8b3a44] p-10 text-white shadow-2xl shadow-[#722f37]/30 lg:flex lg:w-[42%] lg:min-h-full lg:shrink-0 lg:flex-col lg:justify-between lg:rounded-none lg:shadow-none xl:p-12">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-[#f3e4e6]/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="size-4 text-amber-200" />
          Join Bus Journey
        </div>
        <h1 className="font-playWrite text-4xl font-semibold leading-tight">
          Your next trip starts here
        </h1>
        <p className="mt-4 max-w-sm text-base text-white/85">
          Complete registration to book buses, track journeys, and manage your
          travel in one place.
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <img
          src="/images/register-image.png"
          alt="Yellow school bus illustration"
          className="h-auto w-full max-h-[220px] max-w-[300px] object-contain xl:max-h-[240px] xl:max-w-[320px]"
          width={320}
          height={240}
        />
      </div>

      <div className="relative z-10 space-y-4">
        {REGISTER_HERO_FEATURES.map(item => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
          >
            <Bus className="size-5 shrink-0 text-amber-200" />
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
