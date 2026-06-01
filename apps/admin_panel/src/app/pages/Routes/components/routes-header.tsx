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

export type RouteStatusFilter = 'all' | 'active' | 'inactive';

interface RoutesHeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  statusFilter: RouteStatusFilter;
  onApplyStatus: (status: RouteStatusFilter) => void;
  onClearStatus: () => void;
  onAddRoute: () => void;
}

export function RoutesHeader({
  searchInput,
  onSearchChange,
  statusFilter,
  onApplyStatus,
  onClearStatus,
  onAddRoute,
}: RoutesHeaderProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [tempStatus, setTempStatus] = useState<RouteStatusFilter>(statusFilter);

  const openChange = (open: boolean) => {
    if (open) setTempStatus(statusFilter);
    setIsFiltersOpen(open);
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Routes Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage travel routes, stops and pricing across your network.
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
            placeholder="Search routes, codes, cities..."
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
              {statusFilter !== 'all' && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0077b6] text-xs text-white">
                  1
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[360px] space-y-6 rounded-2xl border-slate-200 bg-white p-7 shadow-2xl"
            align="end"
            sideOffset={12}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Status
              </Label>
              <Select
                value={tempStatus}
                onValueChange={val => setTempStatus(val as RouteStatusFilter)}
              >
                <SelectTrigger className="h-13 rounded-xl border-slate-300 px-5 text-base shadow-sm focus:border-[#0077b6] focus:ring-[#0077b6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white p-1 shadow-xl">
                  <SelectItem
                    value="all"
                    className="cursor-pointer rounded-lg py-3 text-base"
                  >
                    All Routes
                  </SelectItem>
                  <SelectItem
                    value="active"
                    className="cursor-pointer rounded-lg py-3 text-base"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="inactive"
                    className="cursor-pointer rounded-lg py-3 text-base"
                  >
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="h-12 flex-1 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                onClick={() => {
                  setTempStatus('all');
                  onClearStatus();
                  setIsFiltersOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                className="h-12 flex-1 rounded-xl bg-[#0077b6] font-bold text-white shadow-lg hover:bg-[#036aa0]"
                onClick={() => {
                  onApplyStatus(tempStatus);
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
          onClick={onAddRoute}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Route
        </Button>
      </div>
    </div>
  );
}
