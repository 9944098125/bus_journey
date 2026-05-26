// src/interfaces/user.interface.ts

import { Document, Types } from "mongoose";

export type UserRole = "USER" | "ADMIN" | "OPERATOR";

export type AuthProvider = "LOCAL" | "GOOGLE";

export interface IUserPreferences {
	email_notifications: boolean;
	sms_notifications: boolean;
}

export interface ILoginCredentials {
	email?: string;
	phone_number?: string;
	password: string;
}

export interface IUser extends Document {
	_id: Types.ObjectId;

	full_name: string;

	email: string;

	country_code: string;

	phone_number: string;

	password: string;

	profile_picture: string | null;

	role: UserRole;

	auth_provider: AuthProvider;

	is_verified: boolean;

	is_active: boolean;

	wallet_balance: number;

	reward_points: number;

	last_login_at?: Date;

	preferences: IUserPreferences;

	createdAt: Date;

	updatedAt: Date;
}
