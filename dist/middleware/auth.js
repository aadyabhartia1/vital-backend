"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
// Mock Authentication Middleware
// In a real application, this would use Clerk's SDK to verify the JWT
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    // Mock extracting user ID from token
    req.user = { id: "mock-user-123", clerkId: "user_2MockClerkId" };
    next();
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map