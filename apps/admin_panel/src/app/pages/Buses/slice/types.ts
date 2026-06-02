import type { Operator } from '../../Operators/slice/types';

export interface Bus {
  _id: string;
  bus_name: string;
  bus_number: string;
  bus_type: string;
  total_seats: string;
  operator: Operator;
  amenities: string[];
  source_location: string;
  photos?: string[];
  is_active: boolean;
  created_by: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusesState {
  // Empty for now, state is managed by RTK Query
}

export interface GetBusesQueryArg {
  page?: number;
  limit?: number;
  search?: string;
  operator?: string;
  is_active?: boolean;
  seats?: string;
  bus_type?: string;
}

export interface GetBusesResponse {
  success: boolean;
  data: Bus[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBusMutationArg {
  bus_name: string;
  bus_number: string;
  bus_type: string;
  total_seats: string;
  operator: string; // Operator ID
  amenities?: string[];
  source_location: string;
  photos?: string[];
  is_active?: boolean;
}

export interface UpdateBusMutationArg extends Partial<CreateBusMutationArg> {
  id: string;
}
