import type { NextFunction, Request, Response } from "express";

import { Users } from "../models/user.model.js";
import type { JwtPayload } from "../utils/jwt.js";
import { verifyToken } from "../utils/jwt.js";

const getBearerToken = (req: Request): string | undefined => {
	const authorization = req.get("authorization");

	if (!authorization?.startsWith("Bearer ")) {
		return undefined;
	}

	const token = authorization.slice(7).trim();

	return token || undefined;
};

/**
 * Validates JWT access token and attaches the user + payload to the request.
 */
export const requireAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const token = getBearerToken(req);

		if (!token) {
			res.status(401).json({
				success: false,
				message: "Authentication required",
			});

			return;
		}

		const payload: JwtPayload = verifyToken(token);
		const user = await Users.findById(payload.userId).select("-password");

		if (!user) {
			res.status(401).json({
				success: false,
				message: "User not found",
			});

			return;
		}

		if (!user.is_active) {
			res.status(403).json({
				success: false,
				message: "Account is inactive",
			});

			return;
		}

		if (
			user.email.toLowerCase() !== payload.email.toLowerCase() ||
			user.role !== payload.role
		) {
			res.status(401).json({
				success: false,
				message: "Invalid or expired token",
			});

			return;
		}

		req.auth = payload;
		req.user = user;
		next();
	} catch {
		res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};

/**
 * Restricts route to ADMIN role (use after requireAuth).
 */
export const requireAdmin = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	if (req.auth?.role !== "ADMIN") {
		res.status(403).json({
			success: false,
			message: "Admin access required",
		});

		return;
	}

	next();
};
