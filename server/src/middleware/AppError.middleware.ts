import { Request, Response, NextFunction } from "express";
import { MongoServerError } from "mongodb";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof MongoServerError && err.code === 11000) {

    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return res.status(409).json({
        status: "error",
        message: `${field} already exists`,
        field,
        value
    });
}
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
        status: "Failed",
    });
}