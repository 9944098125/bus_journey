import mongoose, { Model, Schema } from "mongoose";

import type { IJourney, JourneyStatus } from "../interfaces/journey.interface.js";

const JOURNEY_STATUSES: JourneyStatus[] = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

const journeySchema = new Schema<IJourney>(
  {
    journey_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    route: {
      type: Schema.Types.ObjectId,
      ref: "Routes",
      required: true,
    },

    bus: {
      type: Schema.Types.ObjectId,
      ref: "Buses",
      required: true,
    },

    departure_at: {
      type: Date,
      required: true,
    },

    arrival_at: {
      type: Date,
      required: true,
    },

    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    available_seats: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: JOURNEY_STATUSES,
      default: "scheduled",
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    driver_photo: {
      type: String,
    },

    driving_license: {
      type: String,
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

journeySchema.index({ departure_at: 1 });
journeySchema.index({ route: 1, departure_at: 1 });
journeySchema.index({ bus: 1, departure_at: 1 });

export const Journeys: Model<IJourney> = mongoose.model<IJourney>(
  "Journeys",
  journeySchema
);
