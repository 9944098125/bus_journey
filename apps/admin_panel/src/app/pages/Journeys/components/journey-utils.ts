import type { Route } from '../../Routes/slice/types';
import {
  Journey,
  JourneyBusRef,
  JourneyRouteRef,
  JourneyStatus,
} from '../slice/types';
import { formatDuration } from '../../Routes/components/route-utils';
import { formatCurrency } from '../../Routes/components/route-utils';

export const PAGE_SIZE = 5;

export const JOURNEY_STATUS_STYLES: Record<JourneyStatus, string> = {
  scheduled: 'bg-sky-50 text-sky-700 ring-sky-200',
  in_progress: 'bg-amber-50 text-amber-800 ring-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function isPopulatedRoute(
  route: Journey['route'],
): route is JourneyRouteRef {
  return typeof route === 'object' && route !== null && '_id' in route;
}

export function isPopulatedBus(bus: Journey['bus']): bus is JourneyBusRef {
  return typeof bus === 'object' && bus !== null && '_id' in bus;
}

export function getJourneyRouteId(journey: Journey): string {
  return isPopulatedRoute(journey.route) ? journey.route._id : journey.route;
}

export function getJourneyBusId(journey: Journey): string {
  return isPopulatedBus(journey.bus) ? journey.bus._id : journey.bus;
}

/** Seat label for display — uses the bus `total_seats` string from the API. */
export function getJourneySeatsDisplay(journey: Journey): string {
  if (isPopulatedBus(journey.bus) && journey.bus.total_seats) {
    return journey.bus.total_seats;
  }

  if (journey.available_seats !== undefined && journey.available_seats !== null) {
    return String(journey.available_seats);
  }

  return '—';
}

export function formatRoutePath(route: JourneyRouteRef | Route): string {
  return `${route.source_city} → ${route.destination_city}`;
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

export { formatDuration, formatCurrency };

export interface JourneyFormState {
  journey_code: string;
  route: string;
  bus: string;
  departure_at: string;
  fare: string;
  status: JourneyStatus;
  is_active: boolean;
  notes: string;
  driver_photo: string;
  driving_license: string;
}

export const EMPTY_JOURNEY_FORM: JourneyFormState = {
  journey_code: '',
  route: '',
  bus: '',
  departure_at: '',
  fare: '',
  status: 'scheduled',
  is_active: true,
  notes: '',
  driver_photo: '',
  driving_license: '',
};
