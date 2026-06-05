import { Operators } from "../models/operator.model.js";

import type { IOperator } from "../interfaces/operator.interface.js";

export class OperatorRepository {
	public async createOperator(data: Partial<IOperator>) {
		return Operators.create(data);
	}

	public async findOperatorByEmail(email: string) {
		return Operators.findOne({
			email: email.trim().toLowerCase(),
		});
	}

	public async findOperatorByPhoneNumber(
		country_code: string,
		phone_number: string,
	) {
		return Operators.findOne({
			country_code: country_code.trim(),
			phone_number: phone_number.trim(),
		});
	}

	public async findOperatorById(id: string) {
		return Operators.findById(id).populate(
			"created_by",
			"full_name email role",
		);
	}

	public async updateOperator(id: string, data: Partial<IOperator>) {
		return Operators.findByIdAndUpdate(id, data, {
			returnDocument: "after",
			runValidators: true,
		}).populate("created_by", "full_name email role");
	}

	public async deleteOperator(id: string) {
		return Operators.findByIdAndDelete(id);
	}

	public async getAllOperators(
		filters: Partial<Pick<IOperator, "is_active">> & { search?: string } = {},
	) {
		const query: any = {};

		if (typeof filters.is_active === "boolean") {
			query.is_active = filters.is_active;
		}

		if (filters.search) {
			const searchRegex = new RegExp(filters.search, "i");
			query.$or = [
				{ operator_name: searchRegex },
				{ email: searchRegex },
				{ phone_number: searchRegex },
				{ address: searchRegex },
				{ gst_number: searchRegex },
			];
		}

		return Operators.find(query)
			.populate("created_by", "full_name email role")
			.sort({ createdAt: -1 });
	}
}
