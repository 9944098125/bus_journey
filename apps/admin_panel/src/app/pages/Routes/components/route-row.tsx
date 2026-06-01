import React from 'react';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  GitBranch,
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
import { RouteItem } from '../slice/types';
import { formatCurrency, formatDuration } from './route-utils';
import { StopsTimeline } from './stops-timeline';

interface RouteRowProps {
  route: RouteItem;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onEdit: (route: RouteItem) => void;
  onDelete: (id: string) => void;
}

export function RouteRow({
  route,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: RouteRowProps) {
  return (
    <>
      <tr className="transition-colors hover:bg-slate-50/70">
        <td className="px-4 py-4">
          <button
            type="button"
            onClick={() => onToggleExpand(route._id)}
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
          <div className="font-semibold text-slate-900">{route.route_name}</div>
          <div className="mt-0.5 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
            {route.route_code}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-medium">{route.source_city}</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <span className="font-medium">{route.destination_city}</span>
          </div>
          {(route.source_state || route.destination_state) && (
            <div className="mt-0.5 text-xs text-slate-400">
              {route.source_state} → {route.destination_state}
            </div>
          )}
        </td>
        <td className="px-6 py-4 text-slate-700">{route.distance_km} km</td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1.5 text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" />
            {formatDuration(route.estimated_duration_minutes)}
          </span>
        </td>
        <td className="px-6 py-4 font-semibold text-slate-900">
          {formatCurrency(route.base_fare)}
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
            <GitBranch className="h-3.5 w-3.5" />
            {route.stops.length}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
              route.is_active
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : 'bg-slate-100 text-slate-500 ring-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                route.is_active ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {route.is_active ? 'Active' : 'Inactive'}
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
                    onClick={() => onEdit(route)}
                    aria-label="Edit route"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit route details</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 rounded-md border-[#991b1b]/70 bg-[#991b1b]/70 text-white shadow-sm hover:border-[#991b1b] hover:bg-[#991b1b] hover:text-white"
                    onClick={() => onDelete(route._id)}
                    aria-label="Delete route"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete route</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-slate-50/60">
          <td colSpan={9} className="px-6 py-6">
            <StopsTimeline stops={route.stops} />
          </td>
        </tr>
      )}
    </>
  );
}
