import express, { type Application } from "express";

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import adminDashboardRoutes from "./routes/admin-dashboard.route.js";
import operatorsRoutes from "./routes/operator.route.js";
import usersRoutes from "./routes/user.route.js";

import busesRoutes from "./routes/bus.route.js";

import routesRoutes from "./routes/route.route.js";

import journeysRoutes from "./routes/journey.route.js";

import { sendError } from "./utils/api-response.js";

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
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);

app.options("*", (req, res) => {
	res.sendStatus(204);
});

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

app.use("/api/operators", operatorsRoutes);

app.use("/api/buses", busesRoutes);

app.use("/api/routes", routesRoutes);

app.use("/api/journeys", journeysRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);

/**
 * 404 handler
 */

app.use((req, res) => {
	console.log(`[DEBUG] 404 — no route for ${req.method} ${req.originalUrl}`);

	sendError(req, res, 404, "Route not found");
});

/**
 * Global error handler
 */

app.use(
	(
		error: Error,
		req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	): void => {
		console.error(error);

		sendError(req, res, 500, error.message || "Internal Server Error");
	},
);

export default app;
