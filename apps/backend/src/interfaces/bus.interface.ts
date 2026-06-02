import { Document, Types } from "mongoose";

export interface IBus extends Document {
  bus_name: string;
  bus_number: string;
  bus_type: string;
  total_seats: string;
  operator: Types.ObjectId;
  amenities: string[];
  source_location: string;
  photos: string[];
  is_active: boolean;
  created_by: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBusQuery {
  page?: number;
  limit?: number;
  search?: string;
  operator?: string;
  is_active?: boolean;
}
