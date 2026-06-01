import mongoose from "mongoose";

import type { IRoute, IRouteStop } from "../interfaces/route.interface.js";
import { RouteRepository } from "../repositories/route.repository.js";

const ROUTE_NOT_FOUND = "Route not found";
const INVALID_ROUTE_ID = "Invalid route id";
const ROUTE_CODE_EXISTS = "Route code already exists";

const VALID_STOP_TYPES = new Set(["boarding", "dropping", "both"]);

const IMMUTABLE_UPDATE_KEYS = new Set([
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
]);

export class RouteService {
  private readonly routeRepository = new RouteRepository();

  private assertValidObjectId(id: string): void {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(INVALID_ROUTE_ID);
    }
  }

  private slugifyCode(value: string): string {
    return value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "")
      .slice(0, 4);
  }

  private generateRouteCode(source_city: string, destination_city: string): string {
    const from = this.slugifyCode(source_city) || "SRC";
    const to = this.slugifyCode(destination_city) || "DST";
    const suffix = Date.now().toString(36).toUpperCase().slice(-4);

    return `${from}-${to}-${suffix}`;
  }

  private normalizeStops(stops?: Partial<IRouteStop>[]): IRouteStop[] {
    if (!stops || stops.length === 0) {
      return [];
    }

    return stops
      .filter((stop) => stop.stop_name?.trim() && stop.city?.trim())
      .map((stop, index) => {
        const stop_type =
          stop.stop_type && VALID_STOP_TYPES.has(stop.stop_type)
            ? stop.stop_type
            : "both";

        return {
          stop_name: stop.stop_name!.trim(),
          city: stop.city!.trim(),
          landmark: stop.landmark?.trim() || undefined,
          stop_type,
          sequence: stop.sequence ?? index + 1,
          distance_from_source_km: Math.max(0, Number(stop.distance_from_source_km) || 0),
          arrival_offset_minutes: Math.max(0, Number(stop.arrival_offset_minutes) || 0),
        } as IRouteStop;
      })
      .sort((a, b) => a.sequence - b.sequence);
  }

  private validateCreatePayload(data: Partial<IRoute>): void {
    if (!data.route_name?.trim()) {
      throw new Error("Route name is required");
    }

    if (!data.source_city?.trim()) {
      throw new Error("Source city is required");
    }

    if (!data.destination_city?.trim()) {
      throw new Error("Destination city is required");
    }

    if (
      data.source_city.trim().toLowerCase() ===
      data.destination_city.trim().toLowerCase()
    ) {
      throw new Error("Source and destination cannot be the same");
    }

    if (data.distance_km === undefined || Number(data.distance_km) < 0) {
      throw new Error("Distance must be a positive number");
    }

    if (
      data.estimated_duration_minutes === undefined ||
      Number(data.estimated_duration_minutes) < 0
    ) {
      throw new Error("Estimated duration must be a positive number");
    }

    if (data.base_fare === undefined || Number(data.base_fare) < 0) {
      throw new Error("Base fare must be a positive number");
    }
  }

  private toUpdatePayload(data: Partial<IRoute>): Partial<IRoute> {
    const payload: Partial<IRoute> = {};

    for (const [key, value] of Object.entries(data) as [
      keyof IRoute,
      IRoute[keyof IRoute]
    ][]) {
      if (IMMUTABLE_UPDATE_KEYS.has(key) || value === undefined) {
        continue;
      }

      (payload as Record<string, unknown>)[key] = value;
    }

    return payload;
  }

  public async createRoute(data: Partial<IRoute>, createdById: string) {
    this.validateCreatePayload(data);

    if (!mongoose.isValidObjectId(createdById)) {
      throw new Error("Invalid creator id");
    }

    let route_code = data.route_code?.trim().toUpperCase();

    if (route_code) {
      const existing = await this.routeRepository.findRouteByCode(route_code);

      if (existing) {
        throw new Error(ROUTE_CODE_EXISTS);
      }
    } else {
      route_code = this.generateRouteCode(
        data.source_city as string,
        data.destination_city as string
      );
    }

    const route = await this.routeRepository.createRoute({
      route_name: (data.route_name as string).trim(),
      route_code,
      source_city: (data.source_city as string).trim(),
      source_state: data.source_state?.trim() || undefined,
      destination_city: (data.destination_city as string).trim(),
      destination_state: data.destination_state?.trim() || undefined,
      distance_km: Number(data.distance_km),
      estimated_duration_minutes: Number(data.estimated_duration_minutes),
      base_fare: Number(data.base_fare),
      stops: this.normalizeStops(data.stops),
      is_active: data.is_active ?? true,
      created_by: new mongoose.Types.ObjectId(createdById),
    });

    const populated = await this.routeRepository.findRouteById(
      route._id.toString()
    );

    if (!populated) {
      throw new Error(ROUTE_NOT_FOUND);
    }

    return populated;
  }

  public async getRouteById(id: string) {
    this.assertValidObjectId(id);

    const route = await this.routeRepository.findRouteById(id);

    if (!route) {
      throw new Error(ROUTE_NOT_FOUND);
    }

    return route;
  }

  public async getAllRoutes(
    page: number = 1,
    limit: number = 10,
    search?: string,
    source_city?: string,
    destination_city?: string,
    is_active?: boolean
  ) {
    const query: Record<string, unknown> = {};

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { route_name: searchRegex },
        { route_code: searchRegex },
        { source_city: searchRegex },
        { destination_city: searchRegex },
      ];
    }

    if (source_city) {
      query.source_city = { $regex: `^${source_city}$`, $options: "i" };
    }

    if (destination_city) {
      query.destination_city = { $regex: `^${destination_city}$`, $options: "i" };
    }

    if (is_active !== undefined) {
      query.is_active = is_active;
    }

    const skip = (page - 1) * limit;

    return this.routeRepository.getRoutes(query, skip, limit);
  }

  public async updateRoute(id: string, data: Partial<IRoute>) {
    this.assertValidObjectId(id);

    const existing = await this.routeRepository.findRouteById(id);

    if (!existing) {
      throw new Error(ROUTE_NOT_FOUND);
    }

    const updatePayload = this.toUpdatePayload(data);

    if (updatePayload.route_name !== undefined) {
      if (!updatePayload.route_name.trim()) {
        throw new Error("Route name cannot be empty");
      }
      updatePayload.route_name = updatePayload.route_name.trim();
    }

    if (updatePayload.route_code !== undefined) {
      const route_code = updatePayload.route_code.trim().toUpperCase();

      if (!route_code) {
        throw new Error("Route code cannot be empty");
      }

      if (route_code !== existing.route_code) {
        const duplicate = await this.routeRepository.findRouteByCode(route_code);

        if (duplicate && duplicate._id.toString() !== id) {
          throw new Error(ROUTE_CODE_EXISTS);
        }
      }

      updatePayload.route_code = route_code;
    }

    if (updatePayload.source_city !== undefined) {
      if (!updatePayload.source_city.trim()) {
        throw new Error("Source city cannot be empty");
      }
      updatePayload.source_city = updatePayload.source_city.trim();
    }

    if (updatePayload.destination_city !== undefined) {
      if (!updatePayload.destination_city.trim()) {
        throw new Error("Destination city cannot be empty");
      }
      updatePayload.destination_city = updatePayload.destination_city.trim();
    }

    const nextSource =
      updatePayload.source_city ?? existing.source_city;
    const nextDestination =
      updatePayload.destination_city ?? existing.destination_city;

    if (nextSource.trim().toLowerCase() === nextDestination.trim().toLowerCase()) {
      throw new Error("Source and destination cannot be the same");
    }

    if (updatePayload.source_state !== undefined) {
      updatePayload.source_state = updatePayload.source_state.trim() || undefined;
    }

    if (updatePayload.destination_state !== undefined) {
      updatePayload.destination_state =
        updatePayload.destination_state.trim() || undefined;
    }

    if (updatePayload.distance_km !== undefined && Number(updatePayload.distance_km) < 0) {
      throw new Error("Distance must be a positive number");
    }

    if (
      updatePayload.estimated_duration_minutes !== undefined &&
      Number(updatePayload.estimated_duration_minutes) < 0
    ) {
      throw new Error("Estimated duration must be a positive number");
    }

    if (updatePayload.base_fare !== undefined && Number(updatePayload.base_fare) < 0) {
      throw new Error("Base fare must be a positive number");
    }

    if (updatePayload.stops !== undefined) {
      updatePayload.stops = this.normalizeStops(updatePayload.stops);
    }

    const updatedRoute = await this.routeRepository.updateRoute(id, updatePayload);

    if (!updatedRoute) {
      throw new Error(ROUTE_NOT_FOUND);
    }

    return updatedRoute;
  }

  public async deleteRoute(id: string) {
    this.assertValidObjectId(id);

    const deletedRoute = await this.routeRepository.deleteRoute(id);

    if (!deletedRoute) {
      throw new Error(ROUTE_NOT_FOUND);
    }

    return deletedRoute;
  }
}
