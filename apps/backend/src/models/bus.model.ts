import mongoose, { Model, Schema } from "mongoose";

import type { IBus } from "../interfaces/bus.interface.js";

const busesSchema = new Schema<IBus>(
  {
    bus_name: {
      type: String,
      required: true,
      trim: true,
    },

    bus_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    bus_type: {
      type: String,
      required: true,
      trim: true,
    },

    total_seats: {
      type: String,
      required: true,
      trim: true,
    },

    operator: {
      type: Schema.Types.ObjectId,
      ref: "Operators",
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    driver_photo: {
      type: String,
    },

    driving_license: {
      type: String,
    },

    photos: {
      type: [String],
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

export const Buses: Model<IBus> = mongoose.model<IBus>("Buses", busesSchema);
