"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), service: "vitalis-ai-backend" });
});
const health_1 = __importDefault(require("./routes/health"));
const sockets_1 = require("./sockets");
// Initialize Socket.io
const io = (0, sockets_1.initSockets)(httpServer);
// Routes
app.use("/api/health", health_1.default);
// app.use("/api/auth", authRoutes);
// app.use("/api/habits", habitRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/notifications", notificationRoutes);
// Error handler
app.use((err, _req, res, _next) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Vitalis AI Backend running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map