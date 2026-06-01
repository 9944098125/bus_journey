import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import Label from '../../../components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import type { Operator } from '../../Operators/slice/types';
import type { Route } from '../../Routes/slice/types';
import {
  JourneyActiveFilter,
  JourneyFilters,
  JourneyLifecycleFilter,
} from '../slice/types';
import { JOURNEY_STATUS_LABELS } from './journey-utils';
import type { JourneyStatus } from '../slice/types';

interface JourneysHeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  filters: JourneyFilters;
  routes: Route[];
  operators: Operator[];
  onApplyFilters: (filters: JourneyFilters) => void;
  onClearFilters: () => void;
  onAddJourney: () => void;
}

const EMPTY_FILTERS: JourneyFilters = {
  lifecycle: 'all',
  active: 'all',
  route: '',
  operator: '',
  bus: '',
};

function countActiveFilters(filters: JourneyFilters): number {
  let count = 0;
  if (filters.lifecycle !== 'all') count += 1;
  if (filters.active !== 'all') count += 1;
  if (filters.route) count += 1;
  if (filters.operator) count += 1;
  return count;
}

export function JourneysHeader({
  searchInput,
  onSearchChange,
  filters,
  routes,
  operators,
  onApplyFilters,
  onClearFilters,
  onAddJourney,
}: JourneysHeaderProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<JourneyFilters>(filters);

  const openChange = (open: boolean) => {
    if (open) setTempFilters(filters);
    setIsFiltersOpen(open);
  };

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Journeys Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Schedule and manage trips by pairing routes with buses.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            placeholder="Search code, route, bus..."
            className="h-12 w-[280px] rounded-xl border-slate-300 pl-10 pr-4 text-base shadow-sm transition-all focus:border-[#0077b6] focus:ring-[#0077b6]"
            value={searchInput}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <Popover open={isFiltersOpen} onOpenChange={openChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-slate-300 px-5 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0077b6] text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[380px] space-y-5 rounded-2xl border-slate-200 bg-white p-7 shadow-2xl"
            align="end"
            sideOffset={12}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Journey status
              </Label>
              <Select
                value={tempFilters.lifecycle}
                onValueChange={val =>
                  setTempFilters(prev => ({
                    ...prev,
                    lifecycle: val as JourneyLifecycleFilter,
                  }))
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-300 px-5 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white">
                  <SelectItem value="all">All statuses</SelectItem>
                  {(Object.keys(JOURNEY_STATUS_LABELS) as JourneyStatus[]).map(
                    status => (
                      <SelectItem key={status} value={status}>
                        {JOURNEY_STATUS_LABELS[status]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Visibility
              </Label>
              <Select
                value={tempFilters.active}
                onValueChange={val =>
                  setTempFilters(prev => ({
                    ...prev,
                    active: val as JourneyActiveFilter,
                  }))
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-300 px-5 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active only</SelectItem>
                  <SelectItem value="inactive">Inactive only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Route
              </Label>
              <Select
                value={tempFilters.route || 'all'}
                onValueChange={val =>
                  setTempFilters(prev => ({
                    ...prev,
                    route: val === 'all' ? '' : val,
                  }))
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-300 px-5 text-base">
                  <SelectValue placeholder="All routes" />
                </SelectTrigger>
                <SelectContent className="max-h-56 rounded-xl bg-white">
                  <SelectItem value="all">All routes</SelectItem>
                  {routes.map(route => (
                    <SelectItem key={route._id} value={route._id}>
                      {route.route_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Operator
              </Label>
              <Select
                value={tempFilters.operator || 'all'}
                onValueChange={val =>
                  setTempFilters(prev => ({
                    ...prev,
                    operator: val === 'all' ? '' : val,
                  }))
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-300 px-5 text-base">
                  <SelectValue placeholder="All operators" />
                </SelectTrigger>
                <SelectContent className="max-h-56 rounded-xl bg-white">
                  <SelectItem value="all">All operators</SelectItem>
                  {operators.map(op => (
                    <SelectItem key={op._id} value={op._id}>
                      {op.operator_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="h-12 flex-1 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                onClick={() => {
                  setTempFilters(EMPTY_FILTERS);
                  onClearFilters();
                  setIsFiltersOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                className="h-12 flex-1 rounded-xl bg-[#0077b6] font-bold text-white shadow-lg hover:bg-[#036aa0]"
                onClick={() => {
                  onApplyFilters(tempFilters);
                  setIsFiltersOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          className="h-12 rounded-xl bg-[#0077b6] px-5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#036aa0]"
          onClick={onAddJourney}
        >
          <Plus className="mr-2 h-4 w-4" /> Schedule Journey
        </Button>
      </div>
    </div>
  );
}
