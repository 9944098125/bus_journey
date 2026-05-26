import mongoose, { Model, Schema } from "mongoose";

import type { IUser } from "../interfaces/user.interface.js";

const usersSchema = new Schema<IUser>(
	{
		full_name: {
			type: String,
			required: true,
			trim: true,
			maxLength: 80,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			maxLength: 100,
			index: true,
		},

		country_code: {
			type: String,
			required: true,
			trim: true,
		},

		phone_number: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},

		password: {
			type: String,
			required: true,
			select: false,
		},

		profile_picture: {
			type: String,
			default: null,
		},

		role: {
			type: String,
			enum: ["USER", "ADMIN", "OPERATOR"],
			default: "USER",
			index: true,
		},

		auth_provider: {
			type: String,
			enum: ["LOCAL", "GOOGLE"],
			default: "LOCAL",
		},

		is_verified: {
			type: Boolean,
			default: false,
		},

		is_active: {
			type: Boolean,
			default: true,
		},

		wallet_balance: {
			type: Number,
			default: 0,
			min: 0,
		},

		reward_points: {
			type: Number,
			default: 0,
			min: 0,
		},

		last_login_at: {
			type: Date,
		},

		preferences: {
			email_notifications: {
				type: Boolean,
				default: true,
			},

			sms_notifications: {
				type: Boolean,
				default: true,
			},
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const Users: Model<IUser> = mongoose.model<IUser>("Users", usersSchema);
