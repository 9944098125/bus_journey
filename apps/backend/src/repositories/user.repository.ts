import { Users } from "../models/user.model.js";

import type { IUser } from "../interfaces/user.interface.js";

export class UserRepository {
	/**
	 * Create user
	 */

	public async createUser(data: Partial<IUser>) {
		return Users.create(data);
	}

	/**
	 * Find user by email
	 */

	public async findUserByEmail(email: string) {
		return Users.findOne({
			email,
		});
	}

	/**
	 * Find user by phone number
	 */

	public async findUserByPhoneNumber(phone_number: string) {
		return Users.findOne({
			phone_number,
		});
	}

	/**
	 * Find user by email or phone number (includes password for auth)
	 */

	public async findUserForLogin(credentials: {
		email?: string;
		phone_number?: string;
	}) {
		if (credentials.email) {
			return Users.findOne({
				email: credentials.email.toLowerCase(),
			});
		}

		if (credentials.phone_number) {
			return Users.findOne({
				phone_number: credentials.phone_number,
			});
		}

		return null;
	}

	/**
	 * Find user by ID
	 */

	public async findUserById(id: string) {
		return Users.findById(id).select("-password");
	}

	/**
	 * Update user
	 */

	public async updateUser(id: string, data: Partial<IUser>) {
		return Users.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
		}).select("-password");
	}

	/**
	 * Delete user
	 */

	public async deleteUser(id: string) {
		return Users.findByIdAndDelete(id);
	}

	/**
	 * Get all users
	 */

	public async getAllUsers() {
		console.log("[DEBUG] UserRepository.getAllUsers — querying MongoDB");

		const users = await Users.find().select("-password").sort({
			createdAt: -1,
		});

		console.log("[DEBUG] UserRepository.getAllUsers — done, count:", users.length);

		return users;
	}
}
