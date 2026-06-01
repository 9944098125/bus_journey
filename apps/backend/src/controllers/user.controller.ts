import type { NextFunction, Request, Response } from "express";

import { UserService } from "../services/user.service.js";
import { sendError, sendItem, sendList } from "../utils/api-response.js";

export class UserController {
	private readonly userService = new UserService();

	/**
	 * Register user
	 */

	public async registerUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user, emailSent } = await this.userService.registerUser(req.body);

			sendItem(
				req,
				res,
				"User registered successfully. Check your email for the activation link.",
				{ user, emailSent },
				201,
			);
		} catch (error) {
			if (
				error instanceof Error &&
				(error.message === "Email already exists" ||
					error.message === "Phone number already exists" ||
					error.message.startsWith("Email is not configured") ||
					error.message.startsWith("Failed to send activation email"))
			) {
				const status =
					error.message === "Email already exists" ||
					error.message === "Phone number already exists"
						? 409
						: 503;

				sendError(req, res, status, error.message);

				return;
			}

			next(error);
		}
	}

	/**
	 * Login user
	 */

	public async loginUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user, token } = await this.userService.loginUser(req.body);

			sendItem(req, res, "Login successful", { token, user });
		} catch (error) {
			if (
				error instanceof Error &&
				(error.message === "Invalid credentials" ||
					error.message === "Password is required" ||
					error.message === "Email or phone number is required" ||
					error.message ===
						"Account not activated. Use your registration login link first.")
			) {
				sendError(req, res, 401, error.message);

				return;
			}

			next(error);
		}
	}

	/**
	 * Activate account and sign in using the first-login magic link token.
	 */

	public async verifyFirstLogin(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const user = req.firstLoginUser;

			if (!user) {
				sendError(req, res, 400, "Login link validation failed");

				return;
			}

			const result = await this.userService.verifyFirstLogin(
				user._id.toString(),
			);

			sendItem(req, res, "Account activated successfully", {
				token: result.token,
				user: result.user,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get user by ID
	 */

	public async getUserById(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;

			const user = await this.userService.getUserById(id as string);

			sendItem(req, res, "User fetched successfully", user);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Update user
	 */

	public async updateUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;

			const updatedUser = await this.userService.updateUser(
				id as string,
				req.body,
			);

			sendItem(req, res, "User updated successfully", updatedUser);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete user
	 */

	public async deleteUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;

			await this.userService.deleteUser(id as string);

			sendItem(req, res, "User deleted successfully", null);
		} catch (error) {
			next(error);
		}
	}

	public async uploadProfilePicture(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			if (!req.file) {
				sendError(req, res, 400, "No file uploaded");

				return;
			}

			/**
			 * Upload image to Cloudinary
			 */

			const uploadedImage = await this.userService.uploadImage(req.file.buffer);

			sendItem(req, res, "Profile image uploaded successfully", {
				imageUrl: uploadedImage.secure_url,
				publicId: uploadedImage.public_id,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete all users and admins
	 */

	public async deleteAllUsers(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { deletedCount, names, deletedUsers } =
				await this.userService.deleteAllUsers();

			sendItem(
				req,
				res,
				deletedCount === 0
					? "No users to delete"
					: "All users and admins deleted successfully",
				{ count: deletedCount, names, deletedUsers },
			);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get all users
	 */

	public async getAllUsers(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const users = await this.userService.getAllUsers();

			sendList(req, res, "Users fetched successfully", {
				pageNumber: page,
				pageSize: limit,
				totalDocuments: users.length,
				totalPages: 1,
				documents: users,
			});
		} catch (error) {
			next(error);
		}
	}
}
