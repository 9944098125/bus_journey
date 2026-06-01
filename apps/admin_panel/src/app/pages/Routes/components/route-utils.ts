import { RouteStopType } from '../slice/types';

export const PAGE_SIZE = 5;

export const STOP_TYPE_STYLES: Record<RouteStopType, string> = {
  boarding: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  dropping: 'bg-rose-50 text-rose-700 ring-rose-200',
  both: 'bg-sky-50 text-sky-700 ring-sky-200',
};

export const STOP_TYPE_DOT: Record<RouteStopType, string> = {
  boarding: 'bg-emerald-500',
  dropping: 'bg-rose-500',
  both: 'bg-sky-500',
};

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
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
  arrival_offset_minutes: string;
}

export interface RouteFormState {
  route_name: string;
  route_code: string;
  source_city: string;
  source_state: string;
  destination_city: string;
  destination_state: string;
  distance_km: string;
  estimated_duration_minutes: string;
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
  estimated_duration_minutes: '',
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
    arrival_offset_minutes: '',
  };
}
