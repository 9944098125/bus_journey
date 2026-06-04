import express from "express";
import healthRouter from "./routes/health.route.js";

const app = express();

app.use("/health", healthRouter);

app.get("/", (_, res) => {
	res.send("API Running");
});

const PORT = Number(process.env.PORT) || 3000;

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
console.log("CORS CONFIG LOADED");

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server running on port ${PORT}`);
});
