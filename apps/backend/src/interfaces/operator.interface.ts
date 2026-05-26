import { Document, Types } from "mongoose";

export interface IOperator extends Document {
	operator_name: string;

	email: string;

	phone_number: string;

	logo?: string;

	gst_number?: string;

	address?: string;

	is_active: boolean;

	created_by: Types.ObjectId;

	createdAt: Date;

	updatedAt: Date;
}
