import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const initSockets = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
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
