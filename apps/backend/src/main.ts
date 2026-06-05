import "dotenv/config";

import type { Server } from "http";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { getMailTransporter } from "./config/mailer.js";

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
	try {
		console.log("============ STARTING V14");

		await connectDatabase();

		try {
			await getMailTransporter().verify();
			console.log("SMTP ready");
		} catch (error) {
			console.warn("SMTP not ready:", error);
		}

		const server: Server = app.listen(PORT, "0.0.0.0", () => {
			console.log(`Server running on port ${PORT}`);
		});

		console.log("Server started:", server.address());
	} catch (error) {
		console.error("Startup failed:", error);
		process.exit(1);
	}
};

void startServer();
