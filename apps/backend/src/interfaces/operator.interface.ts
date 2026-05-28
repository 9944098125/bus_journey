import { Document, Types } from "mongoose";

export interface IOperator extends Document {
  operator_name: string;

  email: string;

  country_code: string;

  phone_number: string;

  logo?: string;

  driver_photo?: string;

  driving_license?: string;

  gst_number?: string;

  address?: string;

  is_active: boolean;

  created_by: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
