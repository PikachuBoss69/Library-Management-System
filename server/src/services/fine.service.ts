import { HydratedDocument} from "mongoose";
import { BorrowModel, IBorrow } from "../models/Borrow.model";
import { BookCopyModel} from "../models/bookCopies.model";
import { IFine, FineModel } from "../models/Fine.model";
import { AppError } from "../utils/AppError";

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

export async function calculateFine(
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