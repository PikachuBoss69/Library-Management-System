import { HydratedDocument, Types} from "mongoose";
import { BorrowModel, IBorrow } from "../models/Borrow.model";
import { IUser, userModel } from "../models/users.model";
import { IBookCopy, BookCopyModel } from "../models/bookCopies.model";
import { AppError } from "../utils/AppError";
import { BookModel } from "@/models/books.model";
import { createFine } from "./fine.service";
import { BorrowQuery, BorrowFilter } from "../types/borrow.types";


export async function issueBook(
    userId: string,
    copyId: string,
    issuedBy: Types.ObjectId
): Promise<HydratedDocument<IBorrow>> {

    await validateUserId(userId);
    await validateCopyId(copyId);

    const issueDate = new Date();
    const dueDate = calculateDueDate(issueDate);

    const borrowRecord = await BorrowModel.create({
        userId,
        copyId,
        issuedBy,
        issueDate,
        dueDate,
        status: "issued",
    });

    return borrowRecord;
}

export async function updateBookDetails(copyId: string, status: "issued" | "available" | "lost"): Promise<void> {

    await updateBookCopyStatus(copyId, status);

    const bookCopy = await findBookCopyByID(copyId);

    if (!bookCopy) {
        throw new AppError("Book copy not found", 404);
    }

    await BookModel.findByIdAndUpdate(
        bookCopy.bookId,
        {
            $inc: {
                availableCopies: status === "issued" || status === "lost" ? -1 : 1,
            },
        }
    );
}

export async function get_AllBorrowedBooks(
    query: BorrowQuery
): Promise<HydratedDocument<IBorrow>[]> {

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: BorrowFilter = {
        status: "issued",
    };

    if (query.userId) {
        filter.userId = query.userId;
    }

    if (query.copyId) {
        filter.copyId = query.copyId;
    }

    if (query.from || query.to) {
        filter.borrowDate = {};

        if (query.from) {
            filter.borrowDate.$gte = new Date(query.from);
        }

        if (query.to) {
            filter.borrowDate.$lte = new Date(query.to);
        }
    }

    return await BorrowModel.find(filter)
        .populate("userId", "userId rollNumber")
        .populate("copyId", "title")
        .populate("copyId", "accessionNumber")
        .sort({ borrowDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
}

export async function get_OverdueBooks(
    query: BorrowQuery
): Promise<HydratedDocument<IBorrow>[]> {

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: BorrowFilter = {    
        status: "issued",
        dueDate: {
            $lt: new Date(),
        },
    }

    if (query.userId) {
        filter.userId = query.userId;
    }
    if (query.copyId) {
        filter.copyId = query.copyId;
    }
    return await BorrowModel.find(filter)
        .populate("userId", "userId rollNumber")
        .populate("copyId", "title")
        .populate("copyId", "accessionNumber")
        .sort({ dueDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
}

 export async function returnIssuedBook(copyId: string,receivedBy: Types.ObjectId): Promise<HydratedDocument<IBorrow>> {
    const borrowRecord = await BorrowModel.findOne({
        copyId,
        status: "issued",
    });

    if (!borrowRecord) {
        throw new AppError("No active borrow record found for this book copy", 404);
    }

    const returnDate = new Date();

    borrowRecord.returnDate = returnDate;
    borrowRecord.receivedBy = receivedBy;
    borrowRecord.status = "returned";

    await borrowRecord.save();
    await  createFine(borrowRecord._id.toString(), borrowRecord.userId.toString());

    return borrowRecord;
 }

export async function reportLostBorrow(
    copyId: string
): Promise<HydratedDocument<IBorrow>> {

    const borrowRecord = await BorrowModel.findOne({
        copyId,
        status: "issued",
    });

    if (!borrowRecord) {
        throw new AppError("No active borrow record found for this book copy", 404);
    }
    const lostDate = new Date();

    borrowRecord.status = "lost";
    borrowRecord.lostDate = lostDate;
    
    await borrowRecord.save();

    await  createFine(borrowRecord._id.toString(), borrowRecord.userId.toString());

    return borrowRecord;
}

export async function getBorrowById(
    borrowId: string | string[]
): Promise<HydratedDocument<IBorrow>> {

    const borrowRecord = await BorrowModel.findById(borrowId);

    if (!borrowRecord) {
        throw new AppError("Borrow record not found", 404);
    }

    return borrowRecord;
}

export async function getActiveBorrowedBooks(
    userId: string
): Promise<HydratedDocument<IBorrow>[]> {

    return await BorrowModel.find({
        userId,
        status: "issued",
    }).sort({ issueDate: -1 });
}

export async function getBorrowHistory(
    userId: string
): Promise<HydratedDocument<IBorrow>[]> {

    return await BorrowModel.find({
        userId,
    }).sort({ issueDate: -1 });
}


async function updateBookCopyStatus(copyId: string, status: string): Promise<void> {
    await BookCopyModel.findByIdAndUpdate(copyId, { status });
}

function calculateDueDate(issueDate: Date): Date {
    const dueDate = new Date(issueDate);

    // One month borrowing period
    dueDate.setMonth(dueDate.getMonth() + 1);

    return dueDate;
}

async function validateUserId(userId: string): Promise<void> {

    if (!userId) {
        throw new AppError("User ID is required", 400);
    }
    const user = await findUserByID(userId);

    if(!user) {
        throw new AppError("User not found", 404);
    }
}

async function validateCopyId(copyId: string): Promise<void> {
    // TODO:
    // 1. Check BookCopy exists
    // 2. Check status === "available"

    if (!copyId) {
        throw new AppError("Book Copy ID is required", 400);
    }
    const bookCopy  = await findBookCopyByID(copyId);

    if(!bookCopy) {
        throw new AppError("Book Copy not found", 404);
    }
    //Important think why id put this ......
     if(bookCopy.status !== "available") {
        throw new AppError("Book Copy is not available", 400);
    }
}

async function findUserByID(userId: string): Promise< HydratedDocument<IUser> | null> {
        const user = await userModel.findById(userId)
        return user;    
}

async function findBookCopyByID(copyId: string): Promise< HydratedDocument<IBookCopy> | null> {
        const bookCopy = await BookCopyModel.findById(copyId)
        return bookCopy;    
}