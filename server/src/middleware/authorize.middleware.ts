import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { IUser } from "../models/users.model";

export function authorizeMiddleware(...allowedRoles: IUser["role"][]) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const user = req.user;

            if (!user) {
                throw new AppError(
                    "Unauthorized. Please login first.",
                    401
                );
            }

            if (!allowedRoles.includes(user.role)) {
                throw new AppError(
                    "You do not have permission to perform this action.",
                    403
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}