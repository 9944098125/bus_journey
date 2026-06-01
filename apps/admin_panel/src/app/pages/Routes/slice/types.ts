export type RouteStopType = 'boarding' | 'dropping' | 'both';

/** A single stop embedded in a route. Backend stops have no `_id`. */
export interface RouteStop {
  stop_name: string;
  city: string;
  landmark?: string;
  stop_type: RouteStopType;
  sequence: number;
  distance_from_source_km: number;
  arrival_offset_minutes: number;
}

export interface RouteCreator {
  _id: string;
  full_name?: string;
  email?: string;
  role?: string;
}

export interface Route {
  _id: string;
  route_name: string;
  route_code: string;
  source_city: string;
  source_state?: string;
  destination_city: string;
  destination_state?: string;
  distance_km: number;
  estimated_duration_minutes: number;
  base_fare: number;
  stops: RouteStop[];
  is_active: boolean;
  created_by?: string | RouteCreator;
  createdAt: string;
  updatedAt: string;
}

/** @deprecated Use {@link Route}. Kept as an alias for backwards compatibility. */
export type RouteItem = Route;

export interface RoutesState {
  // Empty for now, state is managed by RTK Query
}

export type RouteStatusFilter = 'all' | 'active' | 'inactive';

export interface GetRoutesQueryArg {
  page?: number;
  limit?: number;
  search?: string;
  source_city?: string;
  destination_city?: string;
  status?: RouteStatusFilter;
}

export interface GetRoutesResponse {
  success: boolean;
  message?: string;
  data: Route[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Stop shape sent to the backend (no frontend-only `id`). */
export interface RouteStopPayload {
  stop_name: string;
  city: string;
  landmark?: string;
  stop_type: RouteStopType;
  sequence: number;
  distance_from_source_km: number;
  arrival_offset_minutes: number;
}

export interface CreateRouteMutationArg {
  route_name: string;
  route_code?: string;
  source_city: string;
  source_state?: string;
  destination_city: string;
  destination_state?: string;
  distance_km: number;
  estimated_duration_minutes: number;
  base_fare: number;
  is_active?: boolean;
  stops?: RouteStopPayload[];
}

export interface UpdateRouteMutationArg extends Partial<CreateRouteMutationArg> {
  id: string;
}
