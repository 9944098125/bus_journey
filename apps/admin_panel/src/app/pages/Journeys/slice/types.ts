import type { Bus } from '../../Buses/slice/types';
import type { Route } from '../../Routes/slice/types';

export type JourneyStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type JourneyRouteRef = Pick<
  Route,
  | '_id'
  | 'route_name'
  | 'route_code'
  | 'source_city'
  | 'destination_city'
  | 'source_state'
  | 'destination_state'
  | 'distance_km'
  | 'estimated_duration_minutes'
  | 'base_fare'
  | 'is_active'
>;

export type JourneyBusRef = Pick<
  Bus,
  | '_id'
  | 'bus_name'
  | 'bus_number'
  | 'bus_type'
  | 'total_seats'
  | 'is_active'
  | 'operator'
>;

export interface JourneyCreator {
  _id: string;
  full_name?: string;
  email?: string;
  role?: string;
}

export interface Journey {
  _id: string;
  journey_code: string;
  route: JourneyRouteRef | string;
  bus: JourneyBusRef | string;
  departure_at: string;
  arrival_at: string;
  fare: number;
  available_seats: number;
  status: JourneyStatus;
  is_active: boolean;
  notes?: string;
  driver_photo?: string;
  driving_license?: string;
  created_by?: string | JourneyCreator;
  createdAt: string;
  updatedAt: string;
}

export type JourneyItem = Journey;

export interface JourneysState {}

export type JourneyLifecycleFilter =
  | 'all'
  | JourneyStatus;

export type JourneyActiveFilter = 'all' | 'active' | 'inactive';

export interface JourneyFilters {
  lifecycle: JourneyLifecycleFilter;
  active: JourneyActiveFilter;
  route: string;
  operator: string;
  bus: string;
}

export interface GetJourneysQueryArg {
  page?: number;
  limit?: number;
  search?: string;
  route?: string;
  bus?: string;
  operator?: string;
  status?: JourneyStatus;
  is_active?: boolean;
  departure_from?: string;
  departure_to?: string;
}

export interface GetJourneysResponse {
  success: boolean;
  message?: string;
  data: Journey[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateJourneyMutationArg {
  journey_code?: string;
  route: string;
  bus: string;
  departure_at: string;
  arrival_at?: string;
  fare?: number;
  available_seats?: number;
  status?: JourneyStatus;
  is_active?: boolean;
  notes?: string;
  driver_photo?: string;
  driving_license?: string;
}

export interface UpdateJourneyMutationArg
  extends Partial<CreateJourneyMutationArg> {
  id: string;
}
