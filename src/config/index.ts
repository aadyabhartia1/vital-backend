import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000"),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL || "",
  clerkSecretKey: process.env.CLERK_SECRET_KEY || "",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  nodeEnv: process.env.NODE_ENV || "development",
};
