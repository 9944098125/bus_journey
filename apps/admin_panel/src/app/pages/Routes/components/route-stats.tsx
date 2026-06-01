import React from 'react';
import {
  IndianRupee,
  MapPin,
  Navigation,
  Route as RouteIcon,
} from 'lucide-react';

import { RouteItem } from '../slice/types';
import { formatCurrency } from './route-utils';

interface RouteStatsProps {
  routes: RouteItem[];
  totalRoutes?: number;
}

export function RouteStats({ routes, totalRoutes }: RouteStatsProps) {
  const active = routes.filter(r => r.is_active).length;
  const stopsTotal = routes.reduce((sum, r) => sum + r.stops.length, 0);
  const avgFare = routes.length
    ? Math.round(
        routes.reduce((sum, r) => sum + r.base_fare, 0) / routes.length,
      )
    : 0;

  const cards = [
    {
      label: 'Total Routes',
      value: totalRoutes ?? routes.length,
      icon: RouteIcon,
      tint: 'bg-sky-50 text-sky-600',
    },
    {
      label: 'Active Routes',
      value: active,
      icon: Navigation,
      tint: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Total Stops',
      value: stopsTotal,
      icon: MapPin,
      tint: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Avg. Base Fare',
      value: formatCurrency(avgFare),
      icon: IndianRupee,
      tint: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <div
          key={card.label}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.tint}`}
          >
            <card.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
