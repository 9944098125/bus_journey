import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
const FALLBACK_PORTS = [5001, 5005];
const portsToTry = [
    ...new Set([Number(process.env.PORT), ...FALLBACK_PORTS].filter((port) => Number.isFinite(port) && port > 0)),
];
console.log("[DEBUG] Boot — PORT from env:", process.env.PORT, "→ will try:", portsToTry.join(", "));
const listenOnPort = (port) => new Promise((resolve, reject) => {
    const server = app.listen(port, "0.0.0.0");
    server.once("listening", () => resolve(server));
    server.once("error", (error) => {
        server.close();
        reject(error);
    });
});
/**
 * Bootstrap application.
 */
const startServer = async () => {
    try {
        await connectDatabase();
        let server;
        let activePort;
        for (const port of portsToTry) {
            try {
                server = await listenOnPort(port);
                activePort = port;
                break;
            }
            catch (error) {
                const err = error;
                if (err.code !== "EADDRINUSE") {
                    throw error;
                }
                const remaining = portsToTry.filter((candidate) => candidate > port);
                console.warn(`[DEBUG] Port ${port} is already in use${remaining.length > 0
                    ? ` — trying ${remaining.join(", ")}`
                    : ""}`);
            }
        }
        if (!server || activePort === undefined) {
            console.error(`❌ No available port. Tried: ${portsToTry.join(", ")}. Stop other processes (e.g. pnpm dev) or set PORT in .env`);
            process.exit(1);
        }
        const address = server.address();
        console.log("[DEBUG] Server listening:", address);
        console.log(`🚀 Server running on http://127.0.0.1:${activePort}`);
        console.log(`   Try: GET http://127.0.0.1:${activePort}/api/users`);
    }
    catch (error) {
        console.error("❌ Failed to start server", error);
        process.exit(1);
    }
};
void startServer();
