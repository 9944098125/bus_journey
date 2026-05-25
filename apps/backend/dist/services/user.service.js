import bcrypt from "bcrypt";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import { UserRepository } from "../repositories/user.repository.js";
import { buildFirstLoginLink } from "../utils/loginLink.js";
import { signFirstLoginToken, signToken } from "../utils/jwt.js";
export class UserService {
    userRepository = new UserRepository();
    /**
     * Register user
     */
    async registerUser(data) {
        const existingEmail = await this.userRepository.findUserByEmail(data.email);
        if (existingEmail) {
            throw new Error("Email already exists");
        }
        const existingPhone = await this.userRepository.findUserByPhoneNumber(data.phone_number);
        if (existingPhone) {
            throw new Error("Phone number already exists");
        }
        /**
         * Hash password
         */
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.userRepository.createUser({
            ...data,
            password: hashedPassword,
            is_verified: false,
        });
        const firstLoginToken = signFirstLoginToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        const loginLink = buildFirstLoginLink(firstLoginToken);
        const userResponse = await this.userRepository.findUserById(user._id.toString());
        if (!userResponse) {
            throw new Error("User not found");
        }
        return {
            user: userResponse,
            loginLink,
            firstLoginToken,
        };
    }
    /**
     * Complete first login using the magic link token (marks user as verified).
     */
    async verifyFirstLogin(userId) {
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
    async loginUser(credentials) {
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
        const userResponse = await this.userRepository.findUserById(user._id.toString());
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
    async getUserById(id) {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    /**
     * Update user
     */
    async updateUser(id, data) {
        const updatedUser = await this.userRepository.updateUser(id, data);
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    }
    /**
     * Delete user
     */
    async deleteUser(id) {
        const deletedUser = await this.userRepository.deleteUser(id);
        if (!deletedUser) {
            throw new Error("User not found");
        }
        return deletedUser;
    }
    async uploadImage(fileBuffer, folder = "profile-pictures") {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                folder,
                resource_type: "image",
            }, (error, result) => {
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
            });
            streamifier.createReadStream(fileBuffer).pipe(stream);
        });
    }
    /**
     * Get all users
     */
    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }
    /**
     * Delete all users and admins
     */
    async deleteAllUsers() {
        return this.userRepository.deleteAllUsers();
    }
}
