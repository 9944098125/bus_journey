import jwt, { type SignOptions } from "jsonwebtoken";

import type { UserRole } from "../interfaces/user.interface.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "bus-journey-dev-secret";

const signOptions: SignOptions = {
	expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
};

const firstLoginSignOptions: SignOptions = {
	expiresIn: (process.env.FIRST_LOGIN_TOKEN_EXPIRES_IN ??
		"24h") as SignOptions["expiresIn"],
};

export interface JwtPayload {
	userId: string;
	email: string;
	role: UserRole;
}

export interface FirstLoginTokenPayload extends JwtPayload {
	purpose: "first_login";
}

export const signToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, JWT_SECRET, signOptions);
};

export const signFirstLoginToken = (payload: JwtPayload): string => {
	return jwt.sign(
		{ ...payload, purpose: "first_login" },
		JWT_SECRET,
		firstLoginSignOptions,
	);
};

export const verifyFirstLoginToken = (token: string): FirstLoginTokenPayload => {
	const decoded = jwt.verify(token, JWT_SECRET) as FirstLoginTokenPayload;

	if (decoded.purpose !== "first_login") {
		throw new Error("Invalid login link token");
	}

	return decoded;
};

export const verifyToken = (token: string): JwtPayload => {
	const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
		purpose?: string;
	};

	if (decoded.purpose === "first_login") {
		throw new Error("Invalid access token");
	}

	return decoded;
};
