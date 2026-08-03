import {HydratedDocument, Types} from "mongoose";
import { BorrowModel, IBorrow } from "../models/Borrow.model";
import { BookCopyModel} from "../models/bookCopies.model";
import { IFine, FineModel } from "../models/Fine.model";
import { AppError } from "../utils/AppError";

type FineStatus = "pending" | "settled" | "waived";
type FineReason = "late_return" | "lost_book" | "damage";

export interface FineQuery {
    page?: number;
    limit?: number;

    status?: FineStatus;

    reason?: FineReason;

    studentId?: string;

    from?: string;
    to?: string;
}

interface FineFilter {
    status?: FineStatus;
    reason?: FineReason;
    studentId?: string;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}

export async function createFine(
    borrowId: string,
    studentId: string,
): Promise<HydratedDocument<IFine>> {
    
    const borrowRecord = await BorrowModel.findById(borrowId);

    if (!borrowRecord) {
        throw new AppError("Borrow record not found", 404);
    }
    const fineAmount = await calculateFine(borrowRecord);

    if (fineAmount <= 0) {
        throw new AppError("No fine applicable for this borrow record", 400);
    }

    const fineRecord = await FineModel.create({
        borrowId,
        studentId,
        amount: fineAmount,
        reason: borrowRecord.status == "lost" ? "Lost book" : "Late return",
        status: "pending",
    });
    return fineRecord;
}

async function calculateFine(
    borrow: HydratedDocument<IBorrow>
): Promise<number> {

    // No fine while the book is still issued
    if (borrow.status === "issued") {
        return 0;
    }

    const bookCopy = await BookCopyModel.findById(borrow.copyId.toString());

    if (!bookCopy) {
        throw new AppError("Book copy not found", 404);
    }

    // Lost book
    if (borrow.status === "lost") {
        const processingCharge = 250;

        return (bookCopy.price ?? 0) + processingCharge;
    }

    // Returned book
    if (!borrow.returnDate) {
        throw new AppError("Return date not found", 400);
    }

    const gracePeriod = 5;
    const finePerDay = 10;

    const effectiveDueDate = new Date(borrow.dueDate);
    effectiveDueDate.setDate(effectiveDueDate.getDate() + gracePeriod);

    if (borrow.returnDate <= effectiveDueDate) {
        return 0;
    }

    const overdueDays = Math.ceil(
        (borrow.returnDate.getTime() - effectiveDueDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return overdueDays * finePerDay;
}

export async function get_FineByBorrowId(borrowId: string): Promise<HydratedDocument<IFine>>{
    const fine = await FineModel.findOne({borrowId: borrowId});
    if(!fine){
        throw new AppError('Fine not Found', 404);
    }
    return fine;
}

export async function get_AllPendingFines(
    query: FineQuery
): Promise<HydratedDocument<IFine>[]> {

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: FineFilter = {
        status: "pending",
    };

    if (query.reason) {
        filter.reason = query.reason;
    }

    if (query.studentId) {
        filter.studentId = query.studentId;
    }

    if (query.from || query.to) {
        filter.createdAt = {};

        if (query.from) {
            filter.createdAt.$gte = new Date(query.from);
        }

        if (query.to) {
            filter.createdAt.$lte = new Date(query.to);
        }
    }

    return await FineModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
}

export async function get_FineHistory(
    query: FineQuery
): Promise<HydratedDocument<IFine>[]> {

    const {
        page = 1,
        limit = 10,
        status,
        reason,
        studentId,
        from,
        to,
    } = query;

    const filter: FineFilter = {};

    if (status) {
        filter.status = status;
    }

    if (reason) {
        filter.reason = reason;
    }

    if (studentId) {
        filter.studentId = studentId;
    }

    if (from || to) {
        filter.createdAt = {};

        if (from) {
            filter.createdAt.$gte = new Date(from);
        }

        if (to) {
            filter.createdAt.$lte = new Date(to);
        }
    }

    return await FineModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
}

export async function fine_Waived(
    fineId: string,
    waivedBy: string,
    remarks?: string
): Promise<HydratedDocument<IFine>> {

    const fine = await FineModel.findById(fineId);

    if (!fine) {
        throw new AppError("Fine not found.", 404);
    }

    if (fine.status !== "pending") {
        throw new AppError(
            `Fine has already been ${fine.status}.`,
            400
        );
    }

    fine.status = "waived";
    fine.settledBy = new Types.ObjectId(waivedBy);
    fine.waivedDate = new Date();

    if (remarks?.trim()) {
        fine.remarks = remarks.trim();
    }

    await fine.save();

    return fine;
}

export async function pay_FineByCash(
    fineId: string,
    collectedBy: string
): Promise<HydratedDocument<IFine>> {

    const fine = await FineModel.findById(fineId);

    if (!fine) {
        throw new AppError("Fine not found.", 404);
    }

    if (fine.status !== "pending") {
        throw new AppError(
            `Fine has already been ${fine.status}.`,
            400
        );
    }

    fine.status = "settled";
    fine.paymentMethod = "cash";
    fine.paidDate = new Date();
    fine.settledBy = new Types.ObjectId(collectedBy);

    await fine.save();

    return fine;
}

export async function pay_FineByUPI(
    fineId: string
): Promise<HydratedDocument<IFine>> {

    const fine = await FineModel.findById(fineId);

    if (!fine) {
        throw new AppError("Fine not found.", 404);
    }

    if (fine.status !== "pending") {
        throw new AppError(
            `Fine has already been ${fine.status}.`,
            400
        );
    }

    throw new AppError(
        "UPI payment integration is not implemented yet.",
        501
    );
}