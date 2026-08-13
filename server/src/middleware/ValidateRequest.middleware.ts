import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { error } from "node:console";

export const validate = <T extends z.ZodTypeAny>(schema: T): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {

     
        const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
        });
        console.log(result.success);
        if (!result.success) {
            console.error(error);
            throw new AppError(result.error.issues[0]!.message, 400);
            // validation failed
        }
  
        const data = result.data as z.infer<T> & { 
            body?: unknown; 
            params?: unknown; 
            query?: unknown; 
        };

        req.body = data.body ?? req.body;
        res.locals.validated = result.data;

        next();
    };
};