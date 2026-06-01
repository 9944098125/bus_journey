import React from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';

import { RouteStop } from '../slice/types';
import {
  STOP_TYPE_DOT,
  STOP_TYPE_STYLES,
  formatDuration,
  formatStopTypeLabel,
} from './route-utils';

export function StopsTimeline({ stops }: { stops: RouteStop[] }) {
  const ordered = stops.slice().sort((a, b) => a.sequence - b.sequence);

  if (ordered.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No stops configured for this route.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Navigation className="h-4 w-4 text-[#0077b6]" />
        Route Stops Timeline
      </p>
      <ol className="relative ml-3 border-l-2 border-dashed border-slate-200">
        {ordered.map(stop => (
          <li key={stop.sequence} className="mb-5 ml-6 last:mb-0">
            <span
              className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                STOP_TYPE_DOT[stop.stop_type]
              }`}
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-800">
                {stop.stop_name}
              </span>
              <span className="text-sm text-slate-500">· {stop.city}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
                  STOP_TYPE_STYLES[stop.stop_type]
                }`}
              >
                {formatStopTypeLabel(stop.stop_type)}
              </span>
            </div>
            {stop.landmark && (
              <p className="mt-0.5 text-xs text-slate-400">{stop.landmark}</p>
            )}
            <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />{' '}
                {stop.distance_from_source_km} km from source
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />{' '}
                {formatDuration(stop.arrival_offset_minutes)} from source
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
