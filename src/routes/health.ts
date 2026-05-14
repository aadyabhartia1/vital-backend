import { Router } from "express";
import { getDashboardData, addWater, logMood, logMetrics } from "../controllers/healthController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/dashboard", getDashboardData);
router.post("/water", addWater);
router.post("/mood", logMood);
router.post("/metrics", logMetrics);

export default router;
