import type { NextFunction, Request, Response } from "express";

import { Users } from "../models/user.model.js";
import { verifyFirstLoginToken } from "../utils/jwt.js";

const getTokenFromRequest = (req: Request): string | undefined => {
	const queryToken = req.query.token;

	if (typeof queryToken === "string" && queryToken.trim()) {
		return queryToken.trim();
	}

	const bodyToken = req.body?.token;

	if (typeof bodyToken === "string" && bodyToken.trim()) {
		return bodyToken.trim();
	}

	const headerToken = req.get("x-login-token");

	return headerToken?.trim() || undefined;
};

/**
 * Validates the first-login magic link token and attaches the user to the request.
 */
export const validateFirstLoginToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const token = getTokenFromRequest(req);

		if (!token) {
			res.status(400).json({
				success: false,
				message: "Login link token is required",
			});

			return;
		}

		const payload = verifyFirstLoginToken(token);
		const user = await Users.findById(payload.userId);

		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});

			return;
		}

		if (
			user.email.toLowerCase() !== payload.email.toLowerCase() ||
			user.role !== payload.role
		) {
			res.status(401).json({
				success: false,
				message: "Invalid or expired login link",
			});

			return;
		}

		if (user.is_verified) {
			res.status(400).json({
				success: false,
				message:
					"Account is already activated. Please sign in with your email or phone and password.",
			});

			return;
		}

		req.firstLoginUser = user;
		next();
	} catch {
		res.status(401).json({
			success: false,
			message: "Invalid or expired login link",
		});
	}
};

/**
 * Blocks password login until the user has completed first login via the magic link.
 */
export const requireVerifiedForPasswordLogin = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { email, phone_number } = req.body as {
			email?: string;
			phone_number?: string;
		};

		if (!email?.trim() && !phone_number?.trim()) {
			next();

			return;
		}

		const user = await Users.findOne(
			email?.trim()
				? { email: email.trim().toLowerCase() }
				: { phone_number: phone_number?.trim() },
		).select("is_verified email");

		if (user && !user.is_verified) {
			res.status(403).json({
				success: false,
				message:
					"Please activate your account using the login link sent after registration.",
				requiresFirstLoginLink: true,
			});

			return;
		}

		next();
	} catch (error) {
		next(error);
	}
};
