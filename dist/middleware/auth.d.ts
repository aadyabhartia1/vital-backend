import { Request, Response, NextFunction } from "express";
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => void;
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                clerkId: string;
            };
        }
    }
}
//# sourceMappingURL=auth.d.ts.map