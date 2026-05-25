import { Router } from "express";

import { UserController } from "../controllers/user.controller.js";

import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

const userController = new UserController();

/**
 * Register user
 */

router.post(
	"/register",

	userController.registerUser.bind(userController),
);

/**
 * Login user
 */

router.post("/login", userController.loginUser.bind(userController));

/*
 * Get All Users
 */

router.get("/", (req, res, next) => {
	console.log("[DEBUG] GET /api/users — matched getAllUsers route");

	next();
}, userController.getAllUsers.bind(userController));

/**
 * Get user by ID
 */

router.get(
	"/:id",

	userController.getUserById.bind(userController),
);

/**
 * Update user
 */

router.patch(
	"/:id",

	userController.updateUser.bind(userController),
);

/**
 * Delete user
 */

router.delete(
	"/:id",

	userController.deleteUser.bind(userController),
);

/**
 * Upload profile picture
 */

router.post(
	"/upload-profile-picture",

	upload.single("profile_picture"),

	userController.uploadProfilePicture.bind(userController),
);

export default router;
