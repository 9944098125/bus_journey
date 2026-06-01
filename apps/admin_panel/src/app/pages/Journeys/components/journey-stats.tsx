import React from 'react';
import { Bus, Calendar, Map, Ticket } from 'lucide-react';

import { JourneyItem } from '../slice/types';
import { JOURNEY_STATUS_LABELS } from './journey-utils';

interface JourneyStatsProps {
  journeys: JourneyItem[];
  totalJourneys?: number;
}

export function JourneyStats({ journeys, totalJourneys }: JourneyStatsProps) {
  const scheduled = journeys.filter(j => j.status === 'scheduled').length;
  const inProgress = journeys.filter(j => j.status === 'in_progress').length;
  const completed = journeys.filter(j => j.status === 'completed').length;
  const cards = [
    {
      label: 'Total Journeys',
      value: totalJourneys ?? journeys.length,
      icon: Map,
      tint: 'bg-sky-50 text-sky-600',
    },
    {
      label: JOURNEY_STATUS_LABELS.scheduled,
      value: scheduled,
      icon: Calendar,
      tint: 'bg-violet-50 text-violet-600',
    },
    {
      label: JOURNEY_STATUS_LABELS.in_progress,
      value: inProgress,
      icon: Bus,
      tint: 'bg-amber-50 text-amber-600',
    },
    {
      label: JOURNEY_STATUS_LABELS.completed,
      value: completed,
      icon: Ticket,
      tint: 'bg-emerald-50 text-emerald-600',
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
