import { Routes } from "../models/route.model.js";

import type { IRoute } from "../interfaces/route.interface.js";

const CREATED_BY_POPULATE = "full_name email role";

export class RouteRepository {
	public async createRoute(data: Partial<IRoute>) {
		return Routes.create(data);
	}

	public async findRouteById(id: string) {
		return Routes.findById(id).populate("created_by", CREATED_BY_POPULATE);
	}

	public async findRouteByCode(route_code: string) {
		return Routes.findOne({ route_code: route_code.trim().toUpperCase() });
	}

	public async updateRoute(id: string, data: Partial<IRoute>) {
		return Routes.findByIdAndUpdate(id, data, {
			returnDocument: "after",
			runValidators: true,
		}).populate("created_by", CREATED_BY_POPULATE);
	}

	public async deleteRoute(id: string) {
		return Routes.findByIdAndDelete(id);
	}

	public async getRoutes(
		query: Record<string, unknown>,
		skip: number,
		limit: number,
	): Promise<{ data: IRoute[]; total: number }> {
		const [data, total] = await Promise.all([
			Routes.find(query)
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
