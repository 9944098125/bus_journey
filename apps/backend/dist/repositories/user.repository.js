import { Users } from "../models/user.model.js";
export class UserRepository {
    /**
     * Create user
     */
    async createUser(data) {
        return Users.create(data);
    }
    /**
     * Find user by email
     */
    async findUserByEmail(email) {
        return Users.findOne({
            email,
        });
    }
    /**
     * Find user by phone number
     */
    async findUserByPhoneNumber(phone_number) {
        return Users.findOne({
            phone_number,
        });
    }
    /**
     * Find user by email or phone number (includes password for auth)
     */
    async findUserForLogin(credentials) {
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
    async findUserById(id) {
        return Users.findById(id).select("-password");
    }
    /**
     * Update user
     */
    async updateUser(id, data) {
        return Users.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).select("-password");
    }
    /**
     * Delete user
     */
    async deleteUser(id) {
        return Users.findByIdAndDelete(id);
    }
    /**
     * Get all users
     */
    async getAllUsers() {
        console.log("[DEBUG] UserRepository.getAllUsers — querying MongoDB");
        const users = await Users.find().select("-password").sort({
            createdAt: -1,
        });
        console.log("[DEBUG] UserRepository.getAllUsers — done, count:", users.length);
        return users;
    }
}
