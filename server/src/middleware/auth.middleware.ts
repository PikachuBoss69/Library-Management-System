import  {userModel} from "../models/users.model";
import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import { AppError } from "../utils/AppError";


const secret_key = process.env.JWT_SECRET_KEY;

interface JwtPayload {
    userId: string;
}


export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    
        const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ];

        if (!token) {
            throw new AppError("Unauthorized access, token is missing", 401);
        }

        if(!secret_key){
            throw new AppError("JWT secret key is not defined", 500);
        }

        const decoded = jwt.verify(token, secret_key) as JwtPayload;

        const user = await userModel.findById(decoded.userId);

        if(!user){
            throw new AppError("User not found", 404);
        }

        // TODO:
        // Temporary workaround for a Mongoose 9 typing mismatch between
        // `findById()` and `Express.Request.user`.
        // Runtime behavior is correct.
        // Revisit after reviewing the Mongoose 9 type definitions.
        req.user = user as any;

        return next()

    } catch (error) {
        if (error instanceof AppError) {
        throw error;
        }

        throw new AppError(
            "Internal Server Error",
            500
        );
    }
}
