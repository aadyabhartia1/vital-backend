"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSockets = void 0;
const socket_io_1 = require("socket.io");
const initSockets = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Mock achievement unlock after 10 seconds of connection
        setTimeout(() => {
            socket.emit("achievement_unlocked", {
                title: "Early Bird",
                icon: "🌅",
                xpReward: 150
            });
        }, 10000);
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSockets = initSockets;
//# sourceMappingURL=index.js.map