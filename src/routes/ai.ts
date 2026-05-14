import { Router } from "express";
import { chatWithAssistant } from "../controllers/aiController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/chat", chatWithAssistant);

export default router;
