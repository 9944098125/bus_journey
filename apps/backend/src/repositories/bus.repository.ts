import { Buses } from "../models/bus.model.js";
import type { IBus } from "../interfaces/bus.interface.js";

const OPERATOR_POPULATE = "operator_name email phone_number logo";

class BusRepository {
	async createBus(busData: Partial<IBus>): Promise<IBus> {
		const bus = new Buses(busData);
		return await bus.save();
	}

	async getBuses(
		query: any,
		skip: number,
		limit: number,
	): Promise<{ data: IBus[]; total: number }> {
		const [data, total] = await Promise.all([
			Buses.find(query)
				.populate("operator", OPERATOR_POPULATE)
				.skip(skip)
				.limit(limit)
				.sort({ createdAt: -1 })
				.lean(),
			Buses.countDocuments(query),
		]);

		return { data: data as IBus[], total };
	}

	async getBusById(id: string): Promise<IBus | null> {
		return await Buses.findById(id)
			.populate("operator", OPERATOR_POPULATE)
			.lean();
	}

	async getBusByNumber(bus_number: string): Promise<IBus | null> {
		return await Buses.findOne({ bus_number }).lean();
	}

	async updateBus(id: string, updateData: Partial<IBus>): Promise<IBus | null> {
		return await Buses.findByIdAndUpdate(id, updateData, {
			returnDocument: "after",
		}).lean();
	}

	async deleteBus(id: string): Promise<IBus | null> {
		return await Buses.findByIdAndDelete(id).lean();
	}

	async countBuses(query: any): Promise<number> {
		return await Buses.countDocuments(query);
	}
}

export const busRepository = new BusRepository();
