import express, { type Application } from "express";

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import usersRoutes from "./routes/user.route.js";

const app: Application = express();

/**
 * Debug: log every incoming request (remove when done debugging)
 */

app.use((req, _res, next) => {
	console.log(
		`[DEBUG] ${req.method} ${req.originalUrl} — host: ${req.get("host")}`,
	);

	next();
});

/**
 * Security middleware
 */

app.use(helmet());

/**
 * Enable CORS
 */

app.use(
	cors({
		origin: "*",
		credentials: true,
	}),
);

/**
 * Compress response bodies
 */

app.use(compression());

/**
 * Request logging
 */

app.use(morgan("dev"));

/**
 * Body parsers
 */

app.use(express.json());

app.use(
	express.urlencoded({
		extended: true,
	}),
);

/**
 * Health check route
 */

app.get("/", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "Server is running successfully",
	});
});

/**
 * API routes
 */

app.use("/api/users", usersRoutes);

/**
 * 404 handler
 */

app.use((req, res) => {
	console.log(`[DEBUG] 404 — no route for ${req.method} ${req.originalUrl}`);

	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

/**
 * Global error handler
 */

app.use(
	(
		error: Error,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	): void => {
		console.error(error);

		res.status(500).json({
			success: false,
			message: error.message || "Internal Server Error",
		});
	},
);

export default app;
