import mongoose, { Model, Schema } from "mongoose";

import type { IOperator } from "../interfaces/operator.interface.js";

const operatorsSchema = new Schema<IOperator>(
	{
		operator_name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},

		phone_number: {
			type: String,
			required: true,
		},

		logo: {
			type: String,
		},

		gst_number: {
			type: String,
		},

		address: {
			type: String,
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
	},
);

export const Operators: Model<IOperator> = mongoose.model<IOperator>(
	"Operators",
	operatorsSchema,
);
