import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
        status: "Failed",
    });
}