import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "bus-journey-dev-secret";

const signOptions: SignOptions = {
	expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
};

export interface JwtPayload {
	userId: string;
	email: string;
	role: "USER" | "ADMIN";
}

export const signToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, JWT_SECRET, signOptions);
};
