import { UserService } from "../services/user.service.js";
export class UserController {
    userService = new UserService();
    /**
     * Register user
     */
    async registerUser(req, res, next) {
        try {
            const user = await this.userService.registerUser(req.body);
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Login user
     */
    async loginUser(req, res, next) {
        try {
            const { user, token } = await this.userService.loginUser(req.body);
            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                data: user,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                (error.message === "Invalid credentials" ||
                    error.message === "Password is required" ||
                    error.message === "Email or phone number is required")) {
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
     * Get user by ID
     */
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update user
     */
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.updateUser(id, req.body);
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete user
     */
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id);
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadProfilePicture(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all users
     */
    async getAllUsers(_req, res, next) {
        console.log("[DEBUG] UserController.getAllUsers — start");
        try {
            const users = await this.userService.getAllUsers();
            console.log("[DEBUG] UserController.getAllUsers — fetched", users.length, "user(s), sending response");
            res.status(200).json({
                success: true,
                count: users.length,
                data: users,
            });
        }
        catch (error) {
            console.error("[DEBUG] UserController.getAllUsers — error:", error);
            next(error);
        }
    }
}
