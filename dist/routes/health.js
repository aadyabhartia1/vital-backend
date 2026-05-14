"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_1 = require("../controllers/healthController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protect all health routes
router.use(auth_1.requireAuth);
router.get("/dashboard", healthController_1.getDashboardData);
router.post("/water", healthController_1.addWater);
router.post("/mood", healthController_1.logMood);
exports.default = router;
//# sourceMappingURL=health.js.map