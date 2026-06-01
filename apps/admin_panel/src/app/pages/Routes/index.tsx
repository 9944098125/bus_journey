import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Filter,
  GitBranch,
  IndianRupee,
  MapPin,
  Navigation,
  Pencil,
  Plus,
  Route as RouteIcon,
  Trash2,
  X,
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Label from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';

import {
  MOCK_OPERATORS,
  MOCK_ROUTES,
  RouteItem,
  RouteStop,
  RouteStopType,
} from './mock';

const PAGE_SIZE = 5;

const STOP_TYPE_STYLES: Record<RouteStopType, string> = {
  boarding: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  dropping: 'bg-rose-50 text-rose-700 ring-rose-200',
  both: 'bg-sky-50 text-sky-700 ring-sky-200',
};

const STOP_TYPE_DOT: Record<RouteStopType, string> = {
  boarding: 'bg-emerald-500',
  dropping: 'bg-rose-500',
  both: 'bg-sky-500',
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

type FormStop = Omit<RouteStop, 'sequence'>;

interface RouteFormState {
  route_name: string;
  route_code: string;
  source_city: string;
  source_state: string;
  destination_city: string;
  destination_state: string;
  distance_km: string;
  estimated_duration_minutes: string;
  base_fare: string;
  operatorId: string;
  is_active: boolean;
  stops: FormStop[];
}

const EMPTY_FORM: RouteFormState = {
  route_name: '',
  route_code: '',
  source_city: '',
  source_state: '',
  destination_city: '',
  destination_state: '',
  distance_km: '',
  estimated_duration_minutes: '',
  base_fare: '',
  operatorId: '',
  is_active: true,
  stops: [],
};

let stopSeed = 1000;
const nextStopId = () => `new-stop-${stopSeed++}`;

function makeEmptyStop(): FormStop {
  return {
    id: nextStopId(),
    stop_name: '',
    city: '',
    landmark: '',
    stop_type: 'both',
    distance_from_source_km: 0,
    arrival_offset_minutes: 0,
  };
}

export function Routes() {
  const { toast } = useToast();

  const [routes, setRoutes] = useState<RouteItem[]>(MOCK_ROUTES);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [tempStatus, setTempStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  const [formData, setFormData] = useState<RouteFormState>(EMPTY_FORM);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredRoutes = useMemo(() => {
    const term = searchInput.trim().toLowerCase();
    return routes.filter((route) => {
      const matchesSearch =
        !term ||
        [
          route.route_name,
          route.route_code,
          route.source_city,
          route.destination_city,
          route.operator?.operator_name ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(term);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? route.is_active : !route.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [routes, searchInput, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRoutes.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRoutes = filteredRoutes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const stats = useMemo(() => {
    const active = routes.filter((r) => r.is_active).length;
    const stopsTotal = routes.reduce((sum, r) => sum + r.stops.length, 0);
    const avgFare = routes.length
      ? Math.round(routes.reduce((sum, r) => sum + r.base_fare, 0) / routes.length)
      : 0;
    return {
      total: routes.length,
      active,
      stopsTotal,
      avgFare,
    };
  }, [routes]);

  const openCreateSheet = () => {
    setEditingRoute(null);
    setFormData({ ...EMPTY_FORM, stops: [makeEmptyStop(), makeEmptyStop()] });
    setIsSheetOpen(true);
  };

  const openEditSheet = (route: RouteItem) => {
    setEditingRoute(route);
    setFormData({
      route_name: route.route_name,
      route_code: route.route_code,
      source_city: route.source_city,
      source_state: route.source_state ?? '',
      destination_city: route.destination_city,
      destination_state: route.destination_state ?? '',
      distance_km: String(route.distance_km),
      estimated_duration_minutes: String(route.estimated_duration_minutes),
      base_fare: String(route.base_fare),
      operatorId: route.operator?._id ?? '',
      is_active: route.is_active,
      stops: route.stops
        .slice()
        .sort((a, b) => a.sequence - b.sequence)
        .map(({ sequence, ...rest }) => ({ ...rest })),
    });
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingRoute(null);
  };

  const updateStop = (id: string, patch: Partial<FormStop>) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)),
    }));
  };

  const addStop = () => {
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, makeEmptyStop()] }));
  };

  const removeStop = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.filter((stop) => stop.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.route_name.trim()) {
      toast({ title: 'Route name is required', variant: 'destructive' });
      return;
    }
    if (!formData.source_city.trim() || !formData.destination_city.trim()) {
      toast({ title: 'Source and destination cities are required', variant: 'destructive' });
      return;
    }
    if (formData.source_city.trim().toLowerCase() === formData.destination_city.trim().toLowerCase()) {
      toast({ title: 'Source and destination cannot be the same', variant: 'destructive' });
      return;
    }

    const operator = MOCK_OPERATORS.find((op) => op._id === formData.operatorId) ?? null;

    const normalizedStops: RouteStop[] = formData.stops
      .filter((stop) => stop.stop_name.trim() && stop.city.trim())
      .map((stop, index) => ({
        id: stop.id,
        stop_name: stop.stop_name.trim(),
        city: stop.city.trim(),
        landmark: stop.landmark?.trim() || undefined,
        stop_type: stop.stop_type,
        sequence: index + 1,
        distance_from_source_km: Number(stop.distance_from_source_km) || 0,
        arrival_offset_minutes: Number(stop.arrival_offset_minutes) || 0,
      }));

    const nowIso = new Date().toISOString();

    const payload: RouteItem = {
      _id: editingRoute?._id ?? `local-${Date.now()}`,
      route_name: formData.route_name.trim(),
      route_code:
        formData.route_code.trim().toUpperCase() ||
        `${formData.source_city.slice(0, 3)}-${formData.destination_city.slice(0, 3)}`.toUpperCase(),
      source_city: formData.source_city.trim(),
      source_state: formData.source_state.trim() || undefined,
      destination_city: formData.destination_city.trim(),
      destination_state: formData.destination_state.trim() || undefined,
      distance_km: Number(formData.distance_km) || 0,
      estimated_duration_minutes: Number(formData.estimated_duration_minutes) || 0,
      base_fare: Number(formData.base_fare) || 0,
      operator,
      is_active: formData.is_active,
      stops: normalizedStops,
      createdAt: editingRoute?.createdAt ?? nowIso,
      updatedAt: nowIso,
    };

    if (editingRoute) {
      setRoutes((prev) => prev.map((r) => (r._id === editingRoute._id ? payload : r)));
      toast({ title: 'Route updated', description: 'Mock data updated locally.' });
    } else {
      setRoutes((prev) => [payload, ...prev]);
      setPage(1);
      toast({ title: 'Route created', description: 'Mock data added locally.' });
    }

    closeSheet();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setRoutes((prev) => prev.filter((r) => r._id !== deleteId));
    toast({ title: 'Route deleted' });
    setDeleteId(null);
  };

  const statCards = [
    {
      label: 'Total Routes',
      value: stats.total,
      icon: RouteIcon,
      tint: 'bg-sky-50 text-sky-600',
    },
    {
      label: 'Active Routes',
      value: stats.active,
      icon: Navigation,
      tint: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Total Stops',
      value: stats.stopsTotal,
      icon: MapPin,
      tint: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Avg. Base Fare',
      value: formatCurrency(stats.avgFare),
      icon: IndianRupee,
      tint: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Routes</title>
      </Helmet>

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Routes Management</h1>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search routes, cities, operators..."
                className="h-12 w-[280px] rounded-xl border-slate-300 pl-10 pr-4 text-base shadow-sm transition-all focus:border-[#0077b6] focus:ring-[#0077b6]"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
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
                    onValueChange={(val) => setTempStatus(val as typeof tempStatus)}
                  >
                    <SelectTrigger className="h-13 rounded-xl border-slate-300 px-5 text-base shadow-sm focus:border-[#0077b6] focus:ring-[#0077b6]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 bg-white p-1 shadow-xl">
                      <SelectItem value="all" className="cursor-pointer rounded-lg py-3 text-base">All Routes</SelectItem>
                      <SelectItem value="active" className="cursor-pointer rounded-lg py-3 text-base">Active</SelectItem>
                      <SelectItem value="inactive" className="cursor-pointer rounded-lg py-3 text-base">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="h-12 flex-1 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                    onClick={() => {
                      setTempStatus('all');
                      setStatusFilter('all');
                      setIsFiltersOpen(false);
                      setPage(1);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    className="h-12 flex-1 rounded-xl bg-[#0077b6] font-bold text-white shadow-lg hover:bg-[#036aa0]"
                    onClick={() => {
                      setStatusFilter(tempStatus);
                      setIsFiltersOpen(false);
                      setPage(1);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              className="h-12 rounded-xl bg-[#0077b6] px-5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#036aa0]"
              onClick={openCreateSheet}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Route
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.tint}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-0.5 text-2xl font-bold text-slate-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="w-10 px-4 py-4" />
                  <th className="px-6 py-4 font-medium text-slate-500">Route</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Path</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Distance</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Duration</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Base Fare</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Stops</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Operator</th>
                  <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                  <th className="px-6 py-4 text-right font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedRoutes.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <RouteIcon className="h-10 w-10" />
                        <p className="text-base font-medium text-slate-500">No routes found</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedRoutes.map((route) => {
                    const isExpanded = expandedId === route._id;
                    return (
                      <React.Fragment key={route._id}>
                        <tr className="transition-colors hover:bg-slate-50/70">
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : route._id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                              title={isExpanded ? 'Hide stops' : 'Show stops'}
                              aria-label="Toggle stops"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                          <td className="px-6 py-4 text-slate-700">
                            {route.operator?.operator_name ?? (
                              <span className="text-slate-400">Unassigned</span>
                            )}
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
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 rounded-md border-[#1e3a8a]/70 bg-[#1e3a8a]/70 text-white shadow-sm hover:border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
                                onClick={() => openEditSheet(route)}
                                title="Edit route"
                                aria-label="Edit route"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 rounded-md border-[#991b1b]/70 bg-[#991b1b]/70 text-white shadow-sm hover:border-[#991b1b] hover:bg-[#991b1b] hover:text-white"
                                onClick={() => setDeleteId(route._id)}
                                title="Delete route"
                                aria-label="Delete route"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-50/60">
                            <td colSpan={10} className="px-6 py-6">
                              <StopsTimeline stops={route.stops} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredRoutes.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-medium text-slate-700">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filteredRoutes.length)}
                </span>{' '}
                of <span className="font-medium text-slate-700">{filteredRoutes.length}</span> routes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-lg border-slate-300 px-4 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="px-2 text-sm font-medium text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-lg border-slate-300 px-4 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-[420px] overflow-y-auto sm:w-[620px]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</SheetTitle>
          </SheetHeader>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            onClick={closeSheet}
            aria-label="Close route form"
            title="Close"
          >
            <X className="h-5 w-5" />
          </Button>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="route_name">Route Name</Label>
              <Input
                id="route_name"
                required
                value={formData.route_name}
                onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                placeholder="e.g. Bangalore → Hyderabad Express"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route_code">Route Code (optional)</Label>
              <Input
                id="route_code"
                value={formData.route_code}
                onChange={(e) => setFormData({ ...formData, route_code: e.target.value })}
                placeholder="Auto-generated if left blank"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="source_city">Source City</Label>
                <Input
                  id="source_city"
                  required
                  value={formData.source_city}
                  onChange={(e) => setFormData({ ...formData, source_city: e.target.value })}
                  placeholder="Bangalore"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source_state">Source State</Label>
                <Input
                  id="source_state"
                  value={formData.source_state}
                  onChange={(e) => setFormData({ ...formData, source_state: e.target.value })}
                  placeholder="Karnataka"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination_city">Destination City</Label>
                <Input
                  id="destination_city"
                  required
                  value={formData.destination_city}
                  onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                  placeholder="Hyderabad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination_state">Destination State</Label>
                <Input
                  id="destination_state"
                  value={formData.destination_state}
                  onChange={(e) => setFormData({ ...formData, destination_state: e.target.value })}
                  placeholder="Telangana"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="distance_km">Distance (km)</Label>
                <Input
                  id="distance_km"
                  type="number"
                  min={0}
                  value={formData.distance_km}
                  onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                  placeholder="575"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={formData.estimated_duration_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, estimated_duration_minutes: e.target.value })
                  }
                  placeholder="540"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_fare">Base Fare (₹)</Label>
                <Input
                  id="base_fare"
                  type="number"
                  min={0}
                  value={formData.base_fare}
                  onChange={(e) => setFormData({ ...formData, base_fare: e.target.value })}
                  placeholder="899"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator">Operator</Label>
              <Select
                value={formData.operatorId || 'none'}
                onValueChange={(val) =>
                  setFormData({ ...formData, operatorId: val === 'none' ? '' : val })
                }
              >
                <SelectTrigger id="operator" className="h-12">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="none">Unassigned</SelectItem>
                  {MOCK_OPERATORS.map((op) => (
                    <SelectItem key={op._id} value={op._id}>
                      {op.operator_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Active</p>
                <p className="text-xs text-slate-500">Inactive routes are hidden from booking.</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            {/* Stops builder */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0077b6]" />
                  <Label className="text-sm font-semibold text-slate-700">
                    Stops ({formData.stops.length})
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg border-[#0077b6]/30 text-[#0077b6] hover:bg-[#0077b6]/5"
                  onClick={addStop}
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Stop
                </Button>
              </div>

              {formData.stops.length === 0 && (
                <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">
                  No stops added yet.
                </p>
              )}

              <div className="space-y-3">
                {formData.stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="space-y-3 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0077b6] text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        Stop {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeStop(stop.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Remove stop"
                        aria-label="Remove stop"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input
                        value={stop.stop_name}
                        onChange={(e) => updateStop(stop.id, { stop_name: e.target.value })}
                        placeholder="Stop name"
                      />
                      <Input
                        value={stop.city}
                        onChange={(e) => updateStop(stop.id, { city: e.target.value })}
                        placeholder="City"
                      />
                      <Input
                        value={stop.landmark ?? ''}
                        onChange={(e) => updateStop(stop.id, { landmark: e.target.value })}
                        placeholder="Landmark (optional)"
                      />
                      <Select
                        value={stop.stop_type}
                        onValueChange={(val) =>
                          updateStop(stop.id, { stop_type: val as RouteStopType })
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="boarding">Boarding</SelectItem>
                          <SelectItem value="dropping">Dropping</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min={0}
                        value={stop.distance_from_source_km}
                        onChange={(e) =>
                          updateStop(stop.id, {
                            distance_from_source_km: Number(e.target.value),
                          })
                        }
                        placeholder="Distance from source (km)"
                      />
                      <Input
                        type="number"
                        min={0}
                        value={stop.arrival_offset_minutes}
                        onChange={(e) =>
                          updateStop(stop.id, {
                            arrival_offset_minutes: Number(e.target.value),
                          })
                        }
                        placeholder="Arrival offset (min)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border-slate-200 px-5 font-semibold text-slate-700 hover:bg-slate-50"
                onClick={closeSheet}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-12 rounded-xl bg-[#0077b6] px-5 font-semibold text-white hover:-translate-y-0.5 hover:bg-[#036aa0]"
              >
                {editingRoute ? 'Save Changes' : 'Create Route'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete Route"
        description="Are you sure you want to delete this route? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />
    </>
  );
}

function StopsTimeline({ stops }: { stops: RouteStop[] }) {
  const ordered = stops.slice().sort((a, b) => a.sequence - b.sequence);

  if (ordered.length === 0) {
    return <p className="text-sm text-slate-400">No stops configured for this route.</p>;
  }

  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Navigation className="h-4 w-4 text-[#0077b6]" />
        Route Stops Timeline
      </p>
      <ol className="relative ml-3 border-l-2 border-dashed border-slate-200">
        {ordered.map((stop) => (
          <li key={stop.id} className="mb-5 ml-6 last:mb-0">
            <span
              className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${STOP_TYPE_DOT[stop.stop_type]}`}
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-800">{stop.stop_name}</span>
              <span className="text-sm text-slate-500">· {stop.city}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ${STOP_TYPE_STYLES[stop.stop_type]}`}
              >
                {stop.stop_type}
              </span>
            </div>
            {stop.landmark && (
              <p className="mt-0.5 text-xs text-slate-400">{stop.landmark}</p>
            )}
            <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {stop.distance_from_source_km} km from source
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> +{formatDuration(stop.arrival_offset_minutes)}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
