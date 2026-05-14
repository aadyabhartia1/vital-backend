"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || "5000"),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    databaseUrl: process.env.DATABASE_URL || "",
    clerkSecretKey: process.env.CLERK_SECRET_KEY || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    nodeEnv: process.env.NODE_ENV || "development",
};
//# sourceMappingURL=index.js.map