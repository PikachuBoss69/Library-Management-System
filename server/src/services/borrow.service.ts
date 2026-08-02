import { HydratedDocument, Types} from "mongoose";
import { BorrowModel, IBorrow } from "../models/Borrow.model";
import { IUser, userModel } from "../models/users.model";
import { IBookCopy, BookCopyModel } from "../models/bookCopies.model";
import { AppError } from "../utils/AppError";
import { BookModel } from "@/models/books.model";
import { createFine } from "./fine.service";

export async function issueBook(
    studentId: string,
    copyId: string,
    issuedBy: Types.ObjectId
): Promise<HydratedDocument<IBorrow>> {

    await validateStudentId(studentId);
    await validateCopyId(copyId);

    const issueDate = new Date();
    const dueDate = calculateDueDate(issueDate);

    const borrowRecord = await BorrowModel.create({
        studentId,
        copyId,
        issuedBy,
        issueDate,
        dueDate,
        status: "issued",
    });

    return borrowRecord;
}

export async function updateBookDetails(copyId: string, status: "borrowed" | "available" | "lost"): Promise<void> {

    await updateBookCopyStatus(copyId, status);

    const bookCopy = await findBookCopyByID(copyId);

    if (!bookCopy) {
        throw new AppError("Book copy not found", 404);
    }

    await BookModel.findByIdAndUpdate(
        bookCopy.bookId,
        {
            $inc: {
                availableCopies: status === "borrowed" || status === "lost" ? -1 : 1,
            },
        }
    );
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
    await  createFine(borrowRecord._id.toString(), borrowRecord.studentId.toString());

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

    await  createFine(borrowRecord._id.toString(), borrowRecord.studentId.toString());

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
    studentId: string
): Promise<HydratedDocument<IBorrow>[]> {

    return await BorrowModel.find({
        studentId,
        status: "issued",
    }).sort({ issueDate: -1 });
}

export async function getBorrowHistory(
    studentId: string
): Promise<HydratedDocument<IBorrow>[]> {

    return await BorrowModel.find({
        studentId,
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

async function validateStudentId(studentId: string): Promise<void> {

    if (!studentId) {
        throw new AppError("Student ID is required", 400);
    }
    const user = await findUserByID(studentId);

    if(!user) {
        throw new AppError("Student not found", 404);
    }
     if(user.role !== "student") {
        throw new AppError("User is not a student", 400);
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