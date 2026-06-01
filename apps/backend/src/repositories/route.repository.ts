import { Routes } from "../models/route.model.js";

import type { IRoute } from "../interfaces/route.interface.js";

const OPERATOR_POPULATE = "operator_name email phone_number logo";
const CREATED_BY_POPULATE = "full_name email role";

export class RouteRepository {
  public async createRoute(data: Partial<IRoute>) {
    return Routes.create(data);
  }

  public async findRouteById(id: string) {
    return Routes.findById(id)
      .populate("operator", OPERATOR_POPULATE)
      .populate("created_by", CREATED_BY_POPULATE);
  }

  public async findRouteByCode(route_code: string) {
    return Routes.findOne({ route_code: route_code.trim().toUpperCase() });
  }

  public async updateRoute(id: string, data: Partial<IRoute>) {
    return Routes.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("operator", OPERATOR_POPULATE)
      .populate("created_by", CREATED_BY_POPULATE);
  }

  public async deleteRoute(id: string) {
    return Routes.findByIdAndDelete(id);
  }

  public async getRoutes(
    query: Record<string, unknown>,
    skip: number,
    limit: number
  ): Promise<{ data: IRoute[]; total: number }> {
    const [data, total] = await Promise.all([
      Routes.find(query)
        .populate("operator", OPERATOR_POPULATE)
        .populate("created_by", CREATED_BY_POPULATE)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Routes.countDocuments(query),
    ]);

    return { data: data as IRoute[], total };
  }

  public async countRoutes(query: Record<string, unknown>): Promise<number> {
    return Routes.countDocuments(query);
  }
}

export const routeRepository = new RouteRepository();
