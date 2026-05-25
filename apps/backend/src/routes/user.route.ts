import { Router } from "express";

import { UserController } from "../controllers/user.controller.js";

import {
	requireVerifiedForPasswordLogin,
	validateFirstLoginToken,
} from "../middlewares/login-token.middleware.js";
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
 * First login via magic link (query: ?token=... or body: { token })
 */

router.get(
	"/login/verify",
	validateFirstLoginToken,
	userController.verifyFirstLogin.bind(userController),
);

router.post(
	"/login/verify",
	validateFirstLoginToken,
	userController.verifyFirstLogin.bind(userController),
);

/**
 * Login user (password login only after first-login link activation)
 */

router.post(
	"/login",
	requireVerifiedForPasswordLogin,
	userController.loginUser.bind(userController),
);

/**
 * Delete all users and admins
 */

router.delete(
	"/all",
	userController.deleteAllUsers.bind(userController),
);

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
