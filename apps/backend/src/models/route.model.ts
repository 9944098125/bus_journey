import mongoose, { Model, Schema } from "mongoose";

import type { IRoute, IRouteStop } from "../interfaces/route.interface.js";

const routeStopSchema = new Schema<IRouteStop>(
  {
    stop_name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    landmark: {
      type: String,
      trim: true,
    },

    stop_type: {
      type: String,
      enum: ["boarding", "dropping", "both", "break"],
      default: "both",
    },

    sequence: {
      type: Number,
      required: true,
      min: 1,
    },

    distance_from_source_km: {
      type: Number,
      default: 0,
      min: 0,
    },

    arrival_offset_minutes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const routesSchema = new Schema<IRoute>(
  {
    route_name: {
      type: String,
      required: true,
      trim: true,
    },

    route_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    source_city: {
      type: String,
      required: true,
      trim: true,
    },

    source_state: {
      type: String,
      trim: true,
    },

    destination_city: {
      type: String,
      required: true,
      trim: true,
    },

    destination_state: {
      type: String,
      trim: true,
    },

    distance_km: {
      type: Number,
      required: true,
      min: 0,
    },

    estimated_duration_minutes: {
      type: Number,
      required: true,
      min: 0,
    },

    base_fare: {
      type: Number,
      required: true,
      min: 0,
    },

    stops: {
      type: [routeStopSchema],
      default: [],
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Routes: Model<IRoute> = mongoose.model<IRoute>(
  "Routes",
  routesSchema
);
