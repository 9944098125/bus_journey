import { RouteStopType } from '../slice/types';

export const PAGE_SIZE = 5;

export const STOP_TYPE_STYLES: Record<RouteStopType, string> = {
  boarding: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  dropping: 'bg-rose-50 text-rose-700 ring-rose-200',
  both: 'bg-sky-50 text-sky-700 ring-sky-200',
  break: 'bg-amber-50 text-amber-800 ring-amber-200',
};

export const STOP_TYPE_DOT: Record<RouteStopType, string> = {
  boarding: 'bg-emerald-500',
  dropping: 'bg-rose-500',
  both: 'bg-sky-500',
  break: 'bg-amber-500',
};

/** Converts stored minutes to decimal hours for the form (e.g. 1290 → "21.5"). */
export function minutesToDecimalHours(totalMinutes: number): string {
  const total = Math.max(0, Math.floor(totalMinutes) || 0);
  if (total === 0) return '';
  const decimal = total / 60;
  const rounded = Math.round(decimal * 100) / 100;
  return String(rounded);
}

/** Parses decimal hours (e.g. "21.5" → 21h 30m → 1290 minutes). */
export function decimalHoursToMinutes(value: string): number {
  const trimmed = value?.trim();
  if (!trimmed) return 0;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) return 0;
  const hours = Math.floor(num);
  const minutes = Math.round((num - hours) * 60);
  return hours * 60 + minutes;
}

export function formatStopTypeLabel(stopType: RouteStopType): string {
  switch (stopType) {
    case 'both':
      return 'Boarding & Dropping';
    case 'boarding':
      return 'Boarding';
    case 'dropping':
      return 'Dropping';
    case 'break':
      return 'Break';
    default:
      return stopType;
  }
}

export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.floor(minutes) || 0);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export interface FormStop {
  id: string;
  stop_name: string;
  city: string;
  landmark?: string;
  stop_type: RouteStopType;
  distance_from_source_km: string;
  arrival_offset: string;
}

export interface RouteFormState {
  route_name: string;
  route_code: string;
  source_city: string;
  source_state: string;
  destination_city: string;
  destination_state: string;
  distance_km: string;
  estimated_duration: string;
  base_fare: string;
  is_active: boolean;
  stops: FormStop[];
}

export const EMPTY_FORM: RouteFormState = {
  route_name: '',
  route_code: '',
  source_city: '',
  source_state: '',
  destination_city: '',
  destination_state: '',
  distance_km: '',
  estimated_duration: '',
  base_fare: '',
  is_active: true,
  stops: [],
};

let stopSeed = 1000;
const nextStopId = () => `new-stop-${stopSeed++}`;

export function makeEmptyStop(): FormStop {
  return {
    id: nextStopId(),
    stop_name: '',
    city: '',
    landmark: '',
    stop_type: 'both',
    distance_from_source_km: '',
    arrival_offset: '',
  };
}
