import type { NextFunction, Request, Response } from "express";

import { UserService } from "../services/user.service.js";

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

			res.status(201).json({
				success: true,

				message:
					"User registered successfully. Check your email for the activation link.",

				data: user,

				emailSent,
			});
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

				res.status(status).json({
					success: false,
					message: error.message,
				});

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

			res.status(200).json({
				success: true,

				message: "Login successful",

				token,

				data: user,
			});
		} catch (error) {
			if (
				error instanceof Error &&
				(error.message === "Invalid credentials" ||
					error.message === "Password is required" ||
					error.message === "Email or phone number is required" ||
					error.message ===
						"Account not activated. Use your registration login link first.")
			) {
				res.status(401).json({
					success: false,

					message: error.message,
				});

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
				res.status(400).json({
					success: false,
					message: "Login link validation failed",
				});

				return;
			}

			const result = await this.userService.verifyFirstLogin(
				user._id.toString(),
			);

			res.status(200).json({
				success: true,
				message: "Account activated successfully",
				token: result.token,
				data: result.user,
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

			res.status(200).json({
				success: true,

				data: user,
			});
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

			res.status(200).json({
				success: true,

				message: "User updated successfully",

				data: updatedUser,
			});
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

			res.status(200).json({
				success: true,

				message: "User deleted successfully",
			});
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
				res.status(400).json({
					success: false,
					message: "No file uploaded",
				});

				return;
			}

			/**
			 * Upload image to Cloudinary
			 */

			const uploadedImage = await this.userService.uploadImage(req.file.buffer);
			const imageUrl = uploadedImage.secure_url;

			res.status(200).json({
				success: true,

				message: "Profile image uploaded successfully",

				imageUrl,

				data: {
					imageUrl,

					publicId: uploadedImage.public_id,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete all users and admins
	 */

	public async deleteAllUsers(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { deletedCount, names, deletedUsers } =
				await this.userService.deleteAllUsers();

			res.status(200).json({
				success: true,
				message:
					deletedCount === 0
						? "No users to delete"
						: "All users and admins deleted successfully",
				count: deletedCount,
				names,
				deletedUsers,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get all users
	 */

	public async getAllUsers(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		console.log("[DEBUG] UserController.getAllUsers — start");

		try {
			const users = await this.userService.getAllUsers();

			console.log(
				"[DEBUG] UserController.getAllUsers — fetched",
				users.length,
				"user(s), sending response",
			);

			res.status(200).json({
				success: true,

				count: users.length,

				data: users,
			});
		} catch (error) {
			console.error("[DEBUG] UserController.getAllUsers — error:", error);

			next(error);
		}
	}
}
