import { Request, Response, NextFunction } from "express";
import {z} from "zod";
import { AppError } from "../utils/AppError";

export const validateRequest = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw new AppError(result.error.issues[0]!.message, 400);
        }

        // Replace req.body with parsed data
        req.body = result.data;

        next();
    };
};