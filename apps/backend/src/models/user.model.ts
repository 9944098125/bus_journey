import mongoose, { Model, Schema } from "mongoose";

import type { IUser } from "../interfaces/user.interface.js";

/**
 * Application users.
 * Handles authentication and profile management.
 */

const usersSchema = new Schema<IUser>(
	{
		full_name: {
			type: String,
			maxLength: 40,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			maxLength: 30,
			required: true,
		},
		country_code: {
			type: String,
			required: true,
		},
		phone_number: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profile_picture: {
			type: String,
		},
		role: {
			type: String,
			enum: ["USER", "ADMIN"],
			default: "USER",
		},
		is_verified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, versionKey: false },
);

export const Users: Model<IUser> = mongoose.model<IUser>("Users", usersSchema);
