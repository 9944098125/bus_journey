import { Document, Types } from "mongoose";

export type JourneyStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IJourney extends Document {
  journey_code: string;
  route: Types.ObjectId;
  bus: Types.ObjectId;
  departure_at: Date;
  arrival_at: Date;
  fare: number;
  available_seats: number;
  status: JourneyStatus;
  is_active: boolean;
  notes?: string;
  driver_photo?: string;
  driving_license?: string;
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJourneyQuery {
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
