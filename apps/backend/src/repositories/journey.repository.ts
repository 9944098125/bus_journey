import { Journeys } from "../models/journey.model.js";

import type { IJourney } from "../interfaces/journey.interface.js";

const CREATED_BY_POPULATE = "full_name email role";

const ROUTE_POPULATE =
  "route_name route_code source_city destination_city source_state destination_state distance_km estimated_duration_minutes base_fare is_active";

const BUS_POPULATE = {
  path: "bus",
  select: "bus_name bus_number bus_type total_seats is_active operator",
  populate: {
    path: "operator",
    select: "operator_name email phone_number logo",
  },
};

export class JourneyRepository {
  public async createJourney(data: Partial<IJourney>) {
    return Journeys.create(data);
  }

  public async findJourneyById(id: string) {
    return Journeys.findById(id)
      .populate("created_by", CREATED_BY_POPULATE)
      .populate("route", ROUTE_POPULATE)
      .populate(BUS_POPULATE);
  }

  public async findJourneyByCode(journey_code: string) {
    return Journeys.findOne({
      journey_code: journey_code.trim().toUpperCase(),
    });
  }

  public async updateJourney(id: string, data: Partial<IJourney>) {
    return Journeys.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("created_by", CREATED_BY_POPULATE)
      .populate("route", ROUTE_POPULATE)
      .populate(BUS_POPULATE);
  }

  public async deleteJourney(id: string) {
    return Journeys.findByIdAndDelete(id);
  }

  public async getJourneys(
    query: Record<string, unknown>,
    skip: number,
    limit: number
  ): Promise<{ data: IJourney[]; total: number }> {
    const [data, total] = await Promise.all([
      Journeys.find(query)
        .populate("created_by", CREATED_BY_POPULATE)
        .populate("route", ROUTE_POPULATE)
        .populate(BUS_POPULATE)
        .skip(skip)
        .limit(limit)
        .sort({ departure_at: 1 })
        .lean(),
      Journeys.countDocuments(query),
    ]);

    return { data: data as IJourney[], total };
  }
}

export const journeyRepository = new JourneyRepository();
