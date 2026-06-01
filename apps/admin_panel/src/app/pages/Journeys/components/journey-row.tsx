import React from 'react';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Button } from '../../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { JourneyItem } from '../slice/types';
import { JourneyDetailPanel } from './journey-detail-panel';
import {
  JOURNEY_STATUS_LABELS,
  JOURNEY_STATUS_STYLES,
  formatCurrency,
  formatDateTime,
  getJourneySeatsDisplay,
  isPopulatedBus,
  isPopulatedRoute,
} from './journey-utils';

interface JourneyRowProps {
  journey: JourneyItem;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onEdit: (journey: JourneyItem) => void;
  onDelete: (id: string) => void;
}

export function JourneyRow({
  journey,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: JourneyRowProps) {
  const route = isPopulatedRoute(journey.route) ? journey.route : null;
  const bus = isPopulatedBus(journey.bus) ? journey.bus : null;

  return (
    <>
      <tr className="transition-colors hover:bg-slate-50/70">
        <td className="px-4 py-4">
          <button
            type="button"
            onClick={() => onToggleExpand(journey._id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title={isExpanded ? 'Hide details' : 'Show details'}
            aria-label="Toggle details"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </td>
        <td className="px-6 py-4">
          <div className="font-semibold text-slate-900">{journey.journey_code}</div>
          {route && (
            <div className="mt-0.5 text-xs text-slate-500">{route.route_name}</div>
          )}
        </td>
        <td className="px-6 py-4">
          {route ? (
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-medium">{route.source_city}</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="font-medium">{route.destination_city}</span>
            </div>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </td>
        <td className="px-6 py-4">
          {bus ? (
            <div>
              <div className="font-medium text-slate-800">{bus.bus_name}</div>
              <div className="text-xs text-slate-500">{bus.bus_number}</div>
            </div>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1.5 text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" />
            {formatDateTime(journey.departure_at)}
          </span>
        </td>
        <td className="px-6 py-4 font-semibold text-slate-900">
          {formatCurrency(journey.fare)}
        </td>
        <td className="px-6 py-4 text-slate-700">
          {getJourneySeatsDisplay(journey)}
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
              JOURNEY_STATUS_STYLES[journey.status]
            }`}
          >
            {JOURNEY_STATUS_LABELS[journey.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
              journey.is_active
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : 'bg-slate-100 text-slate-500 ring-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                journey.is_active ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {journey.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="px-6 py-4">
          <TooltipProvider delayDuration={150}>
            <div className="flex justify-end gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 rounded-md border-[#1e3a8a]/70 bg-[#1e3a8a]/70 text-white shadow-sm hover:border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
                    onClick={() => onEdit(journey)}
                    aria-label="Edit journey"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit journey</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 rounded-md border-[#991b1b]/70 bg-[#991b1b]/70 text-white shadow-sm hover:border-[#991b1b] hover:bg-[#991b1b] hover:text-white"
                    onClick={() => onDelete(journey._id)}
                    aria-label="Delete journey"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete journey</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-slate-50/60">
          <td colSpan={10} className="px-6 py-6">
            <JourneyDetailPanel journey={journey} />
          </td>
        </tr>
      )}
    </>
  );
}
