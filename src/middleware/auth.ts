import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

// This middleware enforces that the user must be authenticated.
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
