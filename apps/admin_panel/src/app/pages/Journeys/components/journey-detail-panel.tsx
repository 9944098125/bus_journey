import React from 'react';
import { Bus, Clock, IndianRupee, MapPin, Route } from 'lucide-react';

import { JourneyItem } from '../slice/types';
import {
  formatCurrency,
  formatDateTime,
  formatRoutePath,
  isPopulatedBus,
  getJourneySeatsDisplay,
  isPopulatedRoute,
} from './journey-utils';

export function JourneyDetailPanel({ journey }: { journey: JourneyItem }) {
  const route = isPopulatedRoute(journey.route) ? journey.route : null;
  const bus = isPopulatedBus(journey.bus) ? journey.bus : null;
  const operator =
    bus && typeof bus.operator === 'object' ? bus.operator : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Route className="h-4 w-4 text-[#0077b6]" />
          Route
        </p>
        {route ? (
          <>
            <p className="font-semibold text-slate-900">{route.route_name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {formatRoutePath(route)} · {route.route_code}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {route.distance_km} km · base fare{' '}
              {formatCurrency(route.base_fare)}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-400">Route details unavailable</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Bus className="h-4 w-4 text-[#0077b6]" />
          Bus
        </p>
        {bus ? (
          <>
            <p className="font-semibold text-slate-900">{bus.bus_name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {bus.bus_number} · {bus.bus_type} · {bus.total_seats}
            </p>
            {operator && (
              <p className="mt-2 text-xs text-slate-400">
                Operator: {operator.operator_name}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-400">Bus details unavailable</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Clock className="h-4 w-4 text-[#0077b6]" />
          Schedule
        </p>
        <p className="text-sm text-slate-700">
          <span className="font-medium">Departs:</span>{' '}
          {formatDateTime(journey.departure_at)}
        </p>
        <p className="mt-1 text-sm text-slate-700">
          <span className="font-medium">Arrives:</span>{' '}
          {formatDateTime(journey.arrival_at)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <IndianRupee className="h-4 w-4 text-[#0077b6]" />
          Pricing & seats
        </p>
        <p className="text-lg font-bold text-slate-900">
          {formatCurrency(journey.fare)}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Bus seats: {getJourneySeatsDisplay(journey)}
        </p>
      </div>

      {journey.notes && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2 lg:col-span-3">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <MapPin className="h-4 w-4 text-[#0077b6]" />
            Notes
          </p>
          <p className="text-sm text-slate-600">{journey.notes}</p>
        </div>
      )}
    </div>
  );
}
