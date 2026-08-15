import mongoose, {HydratedDocument, Types, ClientSession} from "mongoose";
import { BorrowModel, IBorrow } from "../models/Borrow.model";
import { BookCopyModel} from "../models/bookCopies.model";
import { IFine, FineModel } from "../models/Fine.model";
import { AppError } from "../utils/AppError";
import { FineQuery, FineFilter } from "@/types/fine.types";



export async function createFine(
    borrowId: string,
    userId: string,
    session?: ClientSession
): Promise<HydratedDocument<IFine> | void> {

    const ownSession = !session;

    if (!session) {
        session = await mongoose.startSession();
        session.startTransaction();
    }

    try {

        const borrowRecord = await BorrowModel
            .findById(borrowId)
            .session(session);

        if (!borrowRecord) {
            throw new AppError(
                "Borrow record not found",
                404
            );
        }

        const fineAmount = await calculateFine(
            borrowRecord,
            session
        );

        if (fineAmount <= 0) {
            return;
        }

        const [fineRecord] = await FineModel.create(
            [
                {
                    borrowId,
                    userId,
                    amount: fineAmount,
                    reason:
                        borrowRecord.status === "lost"
                            ? "Lost book"
                            : "Late return",
                    status: "pending",
                },
            ],
            {
                session,
            }
        );

        if (ownSession) {
            await session.commitTransaction();
        }

        return fineRecord;

    } catch (error) {

        if (ownSession) {
            await session.abortTransaction();
        }

        throw error;

    } finally {

        if (ownSession) {
            await session.endSession();
        }

    }
}

async function calculateFine(
    borrow: HydratedDocument<IBorrow>,
    session?: ClientSession
): Promise<number> {

    if (borrow.status === "issued") {
        return 0;
    }

    const bookCopy = await BookCopyModel
        .findById(borrow.copyId.toString())
        .session(session ?? null);

    if (!bookCopy) {
        throw new AppError(
            "Book copy not found",
            404
        );
    }

    if (borrow.status === "lost") {

        const processingCharge = 250;

        return (
            (bookCopy.price ?? 0) +
            processingCharge
        );
    }

    if (!borrow.returnDate) {
        throw new AppError(
            "Return date not found",
            400
        );
    }

    const gracePeriod = 5;
    const finePerDay = 10;

    const effectiveDueDate = new Date(
        borrow.dueDate
    );

    effectiveDueDate.setDate(
        effectiveDueDate.getDate() +
        gracePeriod
    );

    if (
        borrow.returnDate <=
        effectiveDueDate
    ) {
        return 0;
    }

    const overdueDays = Math.ceil(
        (
            borrow.returnDate.getTime() -
            effectiveDueDate.getTime()
        ) /
        (1000 * 60 * 60 * 24)
    );

    return overdueDays * finePerDay;
}

export async function get_FineByBorrowId(
    borrowId: string,
    session?: ClientSession
): Promise<HydratedDocument<IFine>> {

    const fine = await FineModel.findOne({
        borrowId,
    }).session(session ?? null);

    if (!fine) {
        throw new AppError(
            "Fine not found",
            404
        );
    }

    return fine;
}

export async function get_AllPendingFines(
    query: FineQuery,
    session?: ClientSession
): Promise<HydratedDocument<IFine>[]> {

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: FineFilter = {
        status: "pending",
    };

    if (query.reason) {
        filter.reason = query.reason;
    }

    if (query.userId) {
        filter.userId = query.userId;
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
        .session(session ?? null)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
}

export async function get_FineHistory(
    query: FineQuery,
    session?: ClientSession
): Promise<HydratedDocument<IFine>[]> {

    const {
        page = 1,
        limit = 10,
        status,
        reason,
        userId,
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

    if (userId) {
        filter.userId = userId;
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
        .session(session ?? null)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
}

export async function fine_Waived(
    fineId: string,
    waivedBy: string,
    remarks?: string,
    session?: ClientSession
): Promise<HydratedDocument<IFine>> {

    const ownSession = !session;

    if (!session) {
        session = await mongoose.startSession();
        session.startTransaction();
    }

    try {

        const fine = await FineModel.findById(fineId)
            .session(session);

        if (!fine) {
            throw new AppError(
                "Fine not found.",
                404
            );
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

        await fine.save({
            session,
        });

        if (ownSession) {
            await session.commitTransaction();
        }

        return fine;

    } catch (error) {

        if (ownSession) {
            await session.abortTransaction();
        }

        throw error;

    } finally {

        if (ownSession) {
            await session.endSession();
        }

    }
}

export async function pay_FineByCash(
    fineId: string,
    collectedBy: string,
    session?: ClientSession
): Promise<HydratedDocument<IFine>> {

    const ownSession = !session;

    if (!session) {
        session = await mongoose.startSession();
        session.startTransaction();
    }

    try {

        const fine = await FineModel.findById(fineId)
            .session(session);

        if (!fine) {
            throw new AppError(
                "Fine not found.",
                404
            );
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

        await fine.save({
            session,
        });

        if (ownSession) {
            await session.commitTransaction();
        }

        return fine;

    } catch (error) {

        if (ownSession) {
            await session.abortTransaction();
        }

        throw error;

    } finally {

        if (ownSession) {
            await session.endSession();
        }

    }
}

export async function pay_FineByUPI(
    fineId: string,
    session?: ClientSession
): Promise<HydratedDocument<IFine>> {

    const fine = await FineModel.findById(fineId)
        .session(session ?? null);

    if (!fine) {
        throw new AppError(
            "Fine not found.",
            404
        );
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

export async function getPendingFineAmount(
    userId: string,
    session?: ClientSession
): Promise<number> {

    const result = await FineModel.aggregate([
        {
            $match: {
                userId,
                status: "pending",
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: {
                    $sum: "$amount",
                },
            },
        },
    ]).session(session ?? null);

    return result[0]?.totalAmount ?? 0;
}

export async function getPendingFineCount(session? : ClientSession): Promise<number> {
    return FineModel.countDocuments({
        status : "pending"
    }).session(session ?? null);
}