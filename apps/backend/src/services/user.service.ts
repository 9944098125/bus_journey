import bcrypt from "bcrypt";
import streamifier from "streamifier";

import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

import cloudinary from "../config/cloudinary.js";

import type {
	ILoginCredentials,
	IUser,
} from "../interfaces/user.interface.js";

import { UserRepository } from "../repositories/user.repository.js";
import { EmailService } from "./email.service.js";

import { buildFirstLoginLink } from "../utils/loginLink.js";
import { signFirstLoginToken, signToken } from "../utils/jwt.js";

export class UserService {
	private readonly userRepository = new UserRepository();
	private readonly emailService = new EmailService();

	/**
	 * Register user
	 */

	public async registerUser(data: Partial<IUser>) {
		const email = (data.email as string).trim().toLowerCase();

		const existingEmail = await this.userRepository.findUserByEmail(email);

		if (existingEmail) {
			throw new Error("Email already exists");
		}

		const existingPhone = await this.userRepository.findUserByPhoneNumber(
			data.phone_number as string,
		);

		if (existingPhone) {
			throw new Error("Phone number already exists");
		}

		/**
		 * Hash password
		 */

		const hashedPassword = await bcrypt.hash(data.password as string, 10);

		const user = await this.userRepository.createUser({
			...data,
			email,
			password: hashedPassword,
			is_verified: false,
		});

		const firstLoginToken = signFirstLoginToken({
			userId: user._id.toString(),
			email: user.email,
			role: user.role,
		});

		const loginLink = buildFirstLoginLink(firstLoginToken);

		try {
			await this.emailService.sendFirstLoginEmail({
				to: user.email,
				fullName: user.full_name,
				loginLink,
				role: user.role,
			});
		} catch (error) {
			await this.userRepository.deleteUser(user._id.toString());
			throw error;
		}

		const userResponse = await this.userRepository.findUserById(
			user._id.toString(),
		);

		if (!userResponse) {
			throw new Error("User not found");
		}

		return {
			user: userResponse,
			emailSent: true,
		};
	}

	/**
	 * Complete first login using the magic link token (marks user as verified).
	 */

	public async verifyFirstLogin(userId: string) {
		const user = await this.userRepository.markUserAsVerified(userId);

		if (!user) {
			throw new Error("User not found");
		}

		const token = signToken({
			userId: user._id.toString(),
			email: user.email,
			role: user.role,
		});

		return {
			user,
			token,
		};
	}

	/**
	 * Login user with email or phone number and password
	 */

	public async loginUser(credentials: ILoginCredentials) {
		const { email, phone_number, password } = credentials;

		if (!password?.trim()) {
			throw new Error("Password is required");
		}

		if (!email?.trim() && !phone_number?.trim()) {
			throw new Error("Email or phone number is required");
		}

		const user = await this.userRepository.findUserForLogin({
			...(email?.trim() ? { email: email.trim().toLowerCase() } : {}),
			...(phone_number?.trim() ? { phone_number: phone_number.trim() } : {}),
		});

		if (!user) {
			throw new Error("Invalid credentials");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new Error("Invalid credentials");
		}

		if (!user.is_verified) {
			throw new Error("Account not activated. Use your registration login link first.");
		}

		const token = signToken({
			userId: user._id.toString(),
			email: user.email,
			role: user.role,
		});

		const userResponse = await this.userRepository.findUserById(
			user._id.toString(),
		);

		if (!userResponse) {
			throw new Error("User not found");
		}

		return {
			user: userResponse,
			token,
		};
	}

	/**
	 * Get single user
	 */

	public async getUserById(id: string) {
		const user = await this.userRepository.findUserById(id);

		if (!user) {
			throw new Error("User not found");
		}

		return user;
	}

	/**
	 * Update user
	 */

	public async updateUser(id: string, data: Partial<IUser>) {
		const updatedUser = await this.userRepository.updateUser(id, data);

		if (!updatedUser) {
			throw new Error("User not found");
		}

		return updatedUser;
	}

	/**
	 * Delete user
	 */

	public async deleteUser(id: string) {
		const deletedUser = await this.userRepository.deleteUser(id);

		if (!deletedUser) {
			throw new Error("User not found");
		}

		return deletedUser;
	}

	public async uploadImage(
		fileBuffer: Buffer,
		folder = "profile-pictures",
	): Promise<{
		secure_url: string;
		public_id: string;
	}> {
		return new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder,

					resource_type: "image",
				},

				(
					error: UploadApiErrorResponse | undefined,
					result: UploadApiResponse | undefined,
				) => {
					if (error || !result) {
						reject(error);

						return;
					}

					const imageUrl = result.secure_url ?? result.url;

					if (!imageUrl) {
						reject(new Error("Cloudinary upload did not return an image URL"));

						return;
					}

					resolve({
						secure_url: imageUrl,

						public_id: result.public_id,
					});
				},
			);

			streamifier.createReadStream(fileBuffer).pipe(stream);
		});
	}

	/**
	 * Get all users
	 */

	public async getAllUsers() {
		return this.userRepository.getAllUsers();
	}

	/**
	 * Delete all users and admins
	 */

	public async deleteAllUsers() {
		return this.userRepository.deleteAllUsers();
	}
}
