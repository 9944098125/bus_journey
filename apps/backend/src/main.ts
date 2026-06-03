import express from "express";
import healthRouter from "./routes/health.route.js";

const app = express();

app.use("/health", healthRouter);

app.get("/", (_, res) => {
  res.send("API Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
