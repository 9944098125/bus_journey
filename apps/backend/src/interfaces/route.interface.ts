import { Document, Types } from "mongoose";

export type RouteStopType = "boarding" | "dropping" | "both";

export interface IRouteStop {
  stop_name: string;
  city: string;
  landmark?: string;
  stop_type: RouteStopType;
  sequence: number;
  distance_from_source_km: number;
  arrival_offset_minutes: number;
}

export interface IRoute extends Document {
  route_name: string;
  route_code: string;
  source_city: string;
  source_state?: string;
  destination_city: string;
  destination_state?: string;
  distance_km: number;
  estimated_duration_minutes: number;
  base_fare: number;
  stops: IRouteStop[];
  operator?: Types.ObjectId;
  is_active: boolean;
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRouteQuery {
  page?: number;
  limit?: number;
  search?: string;
  operator?: string;
  source_city?: string;
  destination_city?: string;
  is_active?: boolean;
}
