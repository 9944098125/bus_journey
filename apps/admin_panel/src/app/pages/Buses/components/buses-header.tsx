import React, { useState } from 'react';
import { Filter } from 'lucide-react';

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

export interface BusFilters {
  seats: string;
  bus_type: string;
}

interface BusesHeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  activeFilters: BusFilters;
  onApply: (filters: BusFilters) => void;
  onClear: () => void;
}

const selectTriggerClass =
  'h-14 text-base px-5 rounded-xl border-slate-300 focus:border-[#0077b6] focus:ring-[#0077b6] transition-all shadow-sm';
const selectItemClass =
  'cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50';

export function BusesHeader({
  searchInput,
  onSearchChange,
  activeFilters,
  onApply,
  onClear,
}: BusesHeaderProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<BusFilters>(activeFilters);
  const activeCount = [activeFilters.seats, activeFilters.bus_type].filter(
    Boolean,
  ).length;

  const openChange = (open: boolean) => {
    if (open) setTempFilters(activeFilters);
    setIsFiltersOpen(open);
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Buses Management
      </h1>
      <div className="flex items-center gap-3">
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
            placeholder="Search buses, operators..."
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
              {activeCount > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0077b6] text-xs text-white">
                  {activeCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[420px] space-y-7 rounded-2xl border-slate-200 bg-white p-8 shadow-2xl"
            align="end"
            sideOffset={12}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Total Seats / Layout
              </Label>
              <Select
                value={tempFilters.seats || 'all'}
                onValueChange={val =>
                  setTempFilters({
                    ...tempFilters,
                    seats: val === 'all' ? '' : val,
                  })
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="All Seats" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white p-1 shadow-xl">
                  <SelectItem value="all" className={selectItemClass}>
                    All Seats
                  </SelectItem>
                  <SelectItem value="25 seats" className={selectItemClass}>
                    25 seats
                  </SelectItem>
                  <SelectItem value="50 seats" className={selectItemClass}>
                    50 seats
                  </SelectItem>
                  <SelectItem
                    value="15 bearths up & down"
                    className={selectItemClass}
                  >
                    15 bearths up & down
                  </SelectItem>
                  <SelectItem
                    value="25 bearths up & down"
                    className={selectItemClass}
                  >
                    25 bearths up & down
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Bus Type
              </Label>
              <Select
                value={tempFilters.bus_type || 'all'}
                onValueChange={val =>
                  setTempFilters({
                    ...tempFilters,
                    bus_type: val === 'all' ? '' : val,
                  })
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white p-1 shadow-xl">
                  <SelectItem value="all" className={selectItemClass}>
                    All Types
                  </SelectItem>
                  <SelectItem value="semi sleeper" className={selectItemClass}>
                    Semi Sleeper
                  </SelectItem>
                  <SelectItem value="sleeper" className={selectItemClass}>
                    Sleeper
                  </SelectItem>
                  <SelectItem value="mini bus" className={selectItemClass}>
                    Mini Bus
                  </SelectItem>
                  <SelectItem
                    value="tour bus/charter"
                    className={selectItemClass}
                  >
                    Tour Bus / Charter
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                className="h-14 flex-1 rounded-xl border-2 border-slate-200 text-base font-bold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-[0.98]"
                onClick={() => {
                  setTempFilters({ seats: '', bus_type: '' });
                  onClear();
                  setIsFiltersOpen(false);
                }}
              >
                Clear Filters
              </Button>
              <Button
                className="h-14 flex-1 rounded-xl bg-[#0077b6] text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#036aa0] active:scale-[0.98]"
                onClick={() => {
                  onApply(tempFilters);
                  setIsFiltersOpen(false);
                }}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
