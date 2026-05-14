import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const app = express();
const httpServer = createServer(app);

import { clerkMiddleware } from "@clerk/express";

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Vitalis API is running...");
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "vitalis-ai-backend" });
});

import healthRoutes from "./routes/health";
import aiRoutes from "./routes/ai";
import { initSockets } from "./sockets";

// Initialize Socket.io
const io = initSockets(httpServer);

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/ai", aiRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/habits", habitRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/notifications", notificationRoutes);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Vitalis AI Backend running on port ${PORT}`);
});

export default app;
