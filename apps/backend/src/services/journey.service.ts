import mongoose, { Types } from "mongoose";

import type { IJourney, JourneyStatus } from "../interfaces/journey.interface.js";
import type { IRoute } from "../interfaces/route.interface.js";
import type { IBus } from "../interfaces/bus.interface.js";
import { busRepository } from "../repositories/bus.repository.js";
import { JourneyRepository } from "../repositories/journey.repository.js";
import { RouteRepository } from "../repositories/route.repository.js";
import { parseSeatCount } from "../utils/seats.js";

const JOURNEY_NOT_FOUND = "Journey not found";
const INVALID_JOURNEY_ID = "Invalid journey id";
const JOURNEY_CODE_EXISTS = "Journey code already exists";
const ROUTE_NOT_FOUND = "Route not found";
const BUS_NOT_FOUND = "Bus not found";
const INVALID_DEPARTURE_AT = "Valid departure date and time is required";
const INVALID_STATUS = "Invalid journey status";

const VALID_STATUSES = new Set<JourneyStatus>([
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

const IMMUTABLE_UPDATE_KEYS = new Set([
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
]);

export class JourneyService {
  private readonly journeyRepository = new JourneyRepository();
  private readonly routeRepository = new RouteRepository();

  private assertValidObjectId(id: string, message = INVALID_JOURNEY_ID): void {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(message);
    }
  }

  private slugifyCode(value: string): string {
    return value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "")
      .slice(0, 4);
  }

  private generateJourneyCode(routeCode: string): string {
    const routePart = this.slugifyCode(routeCode) || "RTE";
    const suffix = Date.now().toString(36).toUpperCase().slice(-4);

    return `JNY-${routePart}-${suffix}`;
  }

  private parseDepartureAt(value: unknown): Date {
    const date = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      throw new Error(INVALID_DEPARTURE_AT);
    }

    return date;
  }

  private computeArrivalAt(
    departure_at: Date,
    durationMinutes: number
  ): Date {
    const duration = Math.max(0, Number(durationMinutes) || 0);

    return new Date(departure_at.getTime() + duration * 60 * 1000);
  }

  private resolveRoute(route: IRoute | null): IRoute {
    if (!route) {
      throw new Error(ROUTE_NOT_FOUND);
    }

    return route;
  }

  private resolveBus(bus: IBus | null): IBus {
    if (!bus) {
      throw new Error(BUS_NOT_FOUND);
    }

    return bus;
  }

  private async getRouteDocument(routeId: string): Promise<IRoute> {
    this.assertValidObjectId(routeId, "Invalid route id");

    const route = await this.routeRepository.findRouteById(routeId);

    return this.resolveRoute(route);
  }

  private async getBusDocument(busId: string): Promise<IBus> {
    this.assertValidObjectId(busId, "Invalid bus id");

    const bus = await busRepository.getBusById(busId);

    return this.resolveBus(bus);
  }

  private getRefId(ref: Types.ObjectId | { _id: Types.ObjectId }): string {
    if (typeof ref === "object" && ref !== null && "_id" in ref) {
      return String(ref._id);
    }

    return String(ref);
  }

  private normalizeStatus(status?: string): JourneyStatus {
    if (status && VALID_STATUSES.has(status as JourneyStatus)) {
      return status as JourneyStatus;
    }

    return "scheduled";
  }

  private validateCreatePayload(data: Partial<IJourney>): void {
    if (!data.route || !mongoose.isValidObjectId(data.route.toString())) {
      throw new Error("Valid route is required");
    }

    if (!data.bus || !mongoose.isValidObjectId(data.bus.toString())) {
      throw new Error("Valid bus is required");
    }

    if (data.departure_at === undefined) {
      throw new Error(INVALID_DEPARTURE_AT);
    }

    if (data.fare !== undefined && Number(data.fare) < 0) {
      throw new Error("Fare must be a positive number");
    }
  }

  private toUpdatePayload(data: Partial<IJourney>): Partial<IJourney> {
    const payload: Partial<IJourney> = {};

    for (const [key, value] of Object.entries(data) as [
      keyof IJourney,
      IJourney[keyof IJourney]
    ][]) {
      if (IMMUTABLE_UPDATE_KEYS.has(key) || value === undefined) {
        continue;
      }

      (payload as Record<string, unknown>)[key] = value;
    }

    return payload;
  }

  private async resolveArrivalAndSeats(options: {
    route: IRoute;
    bus: IBus;
    departure_at: Date;
    arrival_at?: Date;
    available_seats?: number;
  }): Promise<{ arrival_at: Date; available_seats: number }> {
    const arrival_at =
      options.arrival_at ??
      this.computeArrivalAt(
        options.departure_at,
        options.route.estimated_duration_minutes
      );

    const capacity = parseSeatCount(options.bus.total_seats);
    const available_seats =
      options.available_seats !== undefined
        ? Math.max(0, Number(options.available_seats) || 0)
        : capacity;

    if (available_seats > capacity) {
      throw new Error("Available seats cannot exceed bus capacity");
    }

    return { arrival_at, available_seats };
  }

  public async createJourney(data: Partial<IJourney>, createdById: string) {
    this.validateCreatePayload(data);

    if (!mongoose.isValidObjectId(createdById)) {
      throw new Error("Invalid creator id");
    }

    const route = await this.getRouteDocument(data.route!.toString());
    const bus = await this.getBusDocument(data.bus!.toString());

    const departure_at = this.parseDepartureAt(data.departure_at);
    const { arrival_at, available_seats } = await this.resolveArrivalAndSeats({
      route,
      bus,
      departure_at,
      arrival_at:
        data.arrival_at !== undefined
          ? this.parseDepartureAt(data.arrival_at)
          : undefined,
      available_seats: data.available_seats,
    });

    let journey_code = data.journey_code?.trim().toUpperCase();

    if (journey_code) {
      const existing = await this.journeyRepository.findJourneyByCode(
        journey_code
      );

      if (existing) {
        throw new Error(JOURNEY_CODE_EXISTS);
      }
    } else {
      journey_code = this.generateJourneyCode(route.route_code);
    }

    const fare =
      data.fare !== undefined ? Number(data.fare) : Number(route.base_fare);

    if (fare < 0) {
      throw new Error("Fare must be a positive number");
    }

    const journey = await this.journeyRepository.createJourney({
      journey_code,
      route: new mongoose.Types.ObjectId(route._id.toString()),
      bus: new mongoose.Types.ObjectId(bus._id.toString()),
      departure_at,
      arrival_at,
      fare,
      available_seats,
      status: this.normalizeStatus(data.status),
      is_active: data.is_active ?? true,
      notes: data.notes?.trim() || undefined,
      created_by: new mongoose.Types.ObjectId(createdById),
    });

    const populated = await this.journeyRepository.findJourneyById(
      journey._id.toString()
    );

    if (!populated) {
      throw new Error(JOURNEY_NOT_FOUND);
    }

    return populated;
  }

  public async getJourneyById(id: string) {
    this.assertValidObjectId(id);

    const journey = await this.journeyRepository.findJourneyById(id);

    if (!journey) {
      throw new Error(JOURNEY_NOT_FOUND);
    }

    return journey;
  }

  public async getAllJourneys(
    page: number = 1,
    limit: number = 10,
    search?: string,
    routeId?: string,
    busId?: string,
    operatorId?: string,
    status?: JourneyStatus,
    is_active?: boolean,
    departure_from?: string,
    departure_to?: string
  ) {
    const query: Record<string, unknown> = {};

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      const orConditions: Record<string, unknown>[] = [
        { journey_code: searchRegex },
      ];

      const [matchingRoutes, matchingBuses] = await Promise.all([
        mongoose
          .model("Routes")
          .find({
            $or: [
              { route_name: searchRegex },
              { route_code: searchRegex },
              { source_city: searchRegex },
              { destination_city: searchRegex },
            ],
          })
          .select("_id")
          .lean(),
        mongoose
          .model("Buses")
          .find({
            $or: [
              { bus_name: searchRegex },
              { bus_number: searchRegex },
            ],
          })
          .select("_id")
          .lean(),
      ]);

      const routeIds = matchingRoutes.map((doc) => doc._id);
      const busIds = matchingBuses.map((doc) => doc._id);

      if (routeIds.length > 0) {
        orConditions.push({ route: { $in: routeIds } });
      }

      if (busIds.length > 0) {
        orConditions.push({ bus: { $in: busIds } });
      }

      query.$or = orConditions;
    }

    if (routeId && mongoose.isValidObjectId(routeId)) {
      query.route = new mongoose.Types.ObjectId(routeId);
    }

    if (busId && mongoose.isValidObjectId(busId)) {
      query.bus = new mongoose.Types.ObjectId(busId);
    } else if (operatorId && mongoose.isValidObjectId(operatorId)) {
      const operatorBuses = await mongoose
        .model("Buses")
        .find({ operator: operatorId })
        .select("_id")
        .lean();

      const operatorBusIds = operatorBuses.map((doc) => doc._id);

      if (operatorBusIds.length === 0) {
        return { data: [], total: 0 };
      }

      query.bus = { $in: operatorBusIds };
    }

    if (status && VALID_STATUSES.has(status)) {
      query.status = status;
    }

    if (is_active !== undefined) {
      query.is_active = is_active;
    }

    if (departure_from || departure_to) {
      const departureQuery: Record<string, Date> = {};

      if (departure_from) {
        const from = new Date(departure_from);

        if (!Number.isNaN(from.getTime())) {
          departureQuery.$gte = from;
        }
      }

      if (departure_to) {
        const to = new Date(departure_to);

        if (!Number.isNaN(to.getTime())) {
          departureQuery.$lte = to;
        }
      }

      if (Object.keys(departureQuery).length > 0) {
        query.departure_at = departureQuery;
      }
    }

    const skip = (page - 1) * limit;

    return this.journeyRepository.getJourneys(query, skip, limit);
  }

  public async updateJourney(id: string, data: Partial<IJourney>) {
    this.assertValidObjectId(id);

    const existing = await this.journeyRepository.findJourneyById(id);

    if (!existing) {
      throw new Error(JOURNEY_NOT_FOUND);
    }

    const updatePayload = this.toUpdatePayload(data);

    if (updatePayload.journey_code !== undefined) {
      const journey_code = updatePayload.journey_code.trim().toUpperCase();

      if (!journey_code) {
        throw new Error("Journey code cannot be empty");
      }

      if (journey_code !== existing.journey_code) {
        const duplicate = await this.journeyRepository.findJourneyByCode(
          journey_code
        );

        if (duplicate && duplicate._id.toString() !== id) {
          throw new Error(JOURNEY_CODE_EXISTS);
        }
      }

      updatePayload.journey_code = journey_code;
    }

    const existingRouteId = this.getRefId(existing.route);
    const existingBusId = this.getRefId(existing.bus);

    let route = await this.getRouteDocument(
      updatePayload.route !== undefined
        ? updatePayload.route.toString()
        : existingRouteId
    );

    let bus = await this.getBusDocument(
      updatePayload.bus !== undefined
        ? updatePayload.bus.toString()
        : existingBusId
    );

    if (updatePayload.route !== undefined) {
      updatePayload.route = new mongoose.Types.ObjectId(route._id.toString());
    }

    if (updatePayload.bus !== undefined) {
      updatePayload.bus = new mongoose.Types.ObjectId(bus._id.toString());
    }

    const departure_at =
      updatePayload.departure_at !== undefined
        ? this.parseDepartureAt(updatePayload.departure_at)
        : new Date(existing.departure_at);

    if (updatePayload.departure_at !== undefined) {
      updatePayload.departure_at = departure_at;
    }

    if (updatePayload.status !== undefined) {
      if (!VALID_STATUSES.has(updatePayload.status as JourneyStatus)) {
        throw new Error(INVALID_STATUS);
      }
    }

    if (updatePayload.fare !== undefined && Number(updatePayload.fare) < 0) {
      throw new Error("Fare must be a positive number");
    }

    if (updatePayload.notes !== undefined) {
      updatePayload.notes = updatePayload.notes.trim() || undefined;
    }

    const shouldRecalculateArrival =
      updatePayload.departure_at !== undefined ||
      updatePayload.route !== undefined;

    const shouldResolveSeats =
      updatePayload.bus !== undefined ||
      updatePayload.available_seats !== undefined ||
      shouldRecalculateArrival ||
      updatePayload.arrival_at !== undefined;

    if (shouldResolveSeats || shouldRecalculateArrival) {
      const { arrival_at, available_seats } = await this.resolveArrivalAndSeats(
        {
          route,
          bus,
          departure_at,
          arrival_at:
            updatePayload.arrival_at !== undefined
              ? this.parseDepartureAt(updatePayload.arrival_at)
              : shouldRecalculateArrival
                ? undefined
                : new Date(existing.arrival_at),
          available_seats:
            updatePayload.available_seats ?? existing.available_seats,
        }
      );

      updatePayload.arrival_at = arrival_at;
      updatePayload.available_seats = available_seats;
    }

    const updatedJourney = await this.journeyRepository.updateJourney(
      id,
      updatePayload
    );

    if (!updatedJourney) {
      throw new Error(JOURNEY_NOT_FOUND);
    }

    return updatedJourney;
  }

  public async deleteJourney(id: string) {
    this.assertValidObjectId(id);

    const deletedJourney = await this.journeyRepository.deleteJourney(id);

    if (!deletedJourney) {
      throw new Error(JOURNEY_NOT_FOUND);
    }

    return deletedJourney;
  }
}
