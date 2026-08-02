import { Request, Response, NextFunction } from "express";
import * as fineService from "../services/fine.service";

export async function getFineByBorrowId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { borrowId } = res.locals.validated.params;

        const fine = await fineService.get_FineByBorrowId(borrowId);

        res.status(200).json({
            success: true,
            data: fine,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllPendingFines(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const query = res.locals.validated.query;

        const fines = await fineService.get_AllPendingFines(query);

        res.status(200).json({
            success: true,
            data: fines,
        });
    } catch (error) {
        next(error);
    }
}

export async function getFineHistory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const query = res.locals.validated.query;

        const history = await fineService.get_FineHistory(query);

        res.status(200).json({
            success: true,
            data: history,
        });
    } catch (error) {
        next(error);
    }
}

export async function fineWaived(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { fineId } = res.locals.validated.params;
        const { remarks } = req.body;

        const fine = await fineService.fine_Waived(
            fineId,
            req.user!,
            remarks
        );

        res.status(200).json({
            success: true,
            message: "Fine waived successfully.",
            data: fine,
        });
    } catch (error) {
        next(error);
    }
}

export async function payFineByCash(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { fineId } = res.locals.validated.params;
        const body = req.body;

        const fine = await fineService.pay_FineByCash(
            fineId,
            req.user!,
            body
        );

        res.status(200).json({
            success: true,
            message: "Fine paid successfully.",
            data: fine,
        });
    } catch (error) {
        next(error);
    }
}

export async function payFineByUPI(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { fineId } = res.locals.validated.params;

        const result = await fineService.pay_FineByUPI(fineId);

        res.status(501).json({
            success: false,
            message: "UPI payment is not implemented yet.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}