import { Document } from "mongoose";

export interface ILoginCredentials {
	email?: string;
	phone_number?: string;
	password: string;
}

export interface IUser extends Document {
	full_name: string;
	email: string;
	country_code: string;
	phone_number: string;
	password: string;
	profile_picture?: string;
	role: "USER" | "ADMIN";
	is_verified: boolean;
}
