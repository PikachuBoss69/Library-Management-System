import mongoose, { ClientSession, HydratedDocument, Types } from "mongoose";
import { BorrowModel, IBorrow } from "../models/Borrow.model";
import { IUser, userModel } from "../models/users.model";
import { IBookCopy, BookCopyModel } from "../models/bookCopies.model";
import { AppError } from "../utils/AppError";
import { BookModel } from "../models/books.model";
import { createFine } from "./fine.service";
import { BorrowQuery, BorrowFilter, PopulatedBorrow} from "../types/borrow.types";
import { PopulatedBookCopy } from "../types/bookCopy.types";
import {BorrowedBookCard, LibrarianBorrowCard} from '../types/Dashboard.types';

export async function issueBook(
    userId: string,
    copyId: string,
    issuedBy: Types.ObjectId,
    session?: ClientSession
): Promise<HydratedDocument<IBorrow>> {

    const ownSession = !session;

    if (!session) {
        session = await mongoose.startSession();
        session.startTransaction();
    }

    try {

        await validateUserId(userId, session);
        console.log("....................1");
        await validateCopyId(copyId, session);

        const issueDate = new Date();
        const dueDate = calculateDueDate(issueDate);


        const [borrowRecord] = await BorrowModel.create(
            [
                {
                    userId,
                    copyId,
                    issuedBy,
                    issueDate,
                    dueDate,
                    status: "issued",
                },
            ],
            {
                session,
            }
        );
        await updateBookDetails(copyId, "issued", session);

        if (ownSession) {
            await session.commitTransaction();
        }

        return borrowRecord;

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

export async function updateBookDetails(
    copyId: string,
    status: "issued" | "available" | "lost",
    session?: ClientSession
): Promise<void> {

    await updateBookCopyStatus(copyId, status, session);

    const bookCopy = await findBookCopyByID(copyId, session);

    if (!bookCopy) {
        throw new AppError("Book copy not found", 404);
    }

    const increment =
        status === "issued" || status === "lost"
            ? -1
            : 1;

    const book = await BookModel.findByIdAndUpdate(
        bookCopy.bookId,
        {
            $inc: {
                availableCopies: increment,
            },
        },
        {
            session,
        }
    );

    if (!book) {
        throw new AppError("Book not found", 404);
    }
}

export async function get_AllBorrowedBooks(
    query: BorrowQuery,
    session?: ClientSession
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
        .session(session ?? null)
        .populate("userId", "userId rollNumber")
        .populate("copyId", "title accessionNumber")
        .sort({ issueDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
}

export async function get_OverdueBooks(
    query: BorrowQuery,
    session?: ClientSession
): Promise<HydratedDocument<IBorrow>[]> {

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: BorrowFilter = {
        status: "issued",
        dueDate: {
            $lt: new Date(),
        },
    };

    if (query.userId) {
        filter.userId = query.userId;
    }

    if (query.copyId) {
        filter.copyId = query.copyId;
    }

    return await BorrowModel.find(filter)
        .session(session ?? null)
        .populate("userId", "userId rollNumber")
        .populate("copyId", "title accessionNumber")
        .sort({ dueDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
}

 export async function returnIssuedBook(
    copyId: string,
    receivedBy: Types.ObjectId,
    session?: ClientSession
): Promise<HydratedDocument<IBorrow>> {

    const ownSession = !session;

    if (!session) {
        session = await mongoose.startSession();
        session.startTransaction();
    }

    try {

        const borrowRecord = await BorrowModel.findOne({
            copyId,
            status: "issued",
        }).session(session);

        if (!borrowRecord) {
            throw new AppError(
                "No active borrow record found for this book copy",
                404
            );
        }

        borrowRecord.returnDate = new Date();
        borrowRecord.receivedBy = receivedBy;
        borrowRecord.status = "returned";

        await borrowRecord.save({
            session,
        });

        await createFine(
            borrowRecord._id.toString(),
            borrowRecord.userId.toString(),
            session 
        );

        if (ownSession) {
            await session.commitTransaction();
        }

        return borrowRecord;

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

export async function reportLostBorrow(
    copyId: string,
    session?: ClientSession
): Promise<HydratedDocument<IBorrow>> {

    const ownSession = !session;

    if (!session) {
        session = await mongoose.startSession();
        session.startTransaction();
    }

    try {

        const borrowRecord = await BorrowModel.findOne({
            copyId,
            status: "issued",
        }).session(session);

        if (!borrowRecord) {
            throw new AppError(
                "No active borrow record found for this book copy",
                404
            );
        }

        borrowRecord.status = "lost";
        borrowRecord.lostDate = new Date();

        await borrowRecord.save({
            session,
        });

        await createFine(
            borrowRecord._id.toString(),
            borrowRecord.userId.toString(),
            session
        );

        if (ownSession) {
            await session.commitTransaction();
        }

        return borrowRecord;

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

export async function getBorrowById(
    borrowId: string | string[],
    session?: ClientSession
): Promise<HydratedDocument<IBorrow>> {

    const borrowRecord = await BorrowModel
        .findById(borrowId)
        .session(session ?? null);

    if (!borrowRecord) {
        throw new AppError(
            "Borrow record not found",
            404
        );
    }

    return borrowRecord;
}

export async function getActiveBorrowedBooks(
    userId: string,
    session?: ClientSession
): Promise<BorrowedBookCard[]> {

    const borrows = await BorrowModel
        .find({
            userId,
            status: "issued",
        })
        .populate({
            path: "copyId",
            populate: {
                path: "bookId",
            },
        })
        .session(session ?? null)
        .sort({
            issueDate: -1,
        }).limit(10);

    return borrows.map((borrow) => {

        const copy = borrow.copyId as unknown as PopulatedBookCopy;
        const book = copy.bookId;

        return {
            borrowId: borrow._id.toString(),
            copyId: copy._id.toString(),
            accessionNumber: copy.accessionNumber,
            title: book.title,
            author: book.author,
            dueDate: borrow.dueDate,
            borrowedOn: borrow.issueDate,
        };
    });
}
export async function getBorrowHistory(
    userId: string,
    session?: ClientSession
): Promise<HydratedDocument<IBorrow>[]> {

    return await BorrowModel.find({
        userId,
    })
        .session(session ?? null)
        .sort({
            issueDate: -1,
        });
}


async function updateBookCopyStatus(
    copyId: string,
    status: "issued" | "available" | "lost",
    session?: ClientSession
): Promise<void> {

    const bookCopy = await BookCopyModel.findByIdAndUpdate(
        copyId,
        {
            status,
        },
        {
            session,
            new: true,
        }
    );

    if (!bookCopy) {
        throw new AppError(
            "Book copy not found",
            404
        );
    }
}

function calculateDueDate(issueDate: Date): Date {
    const dueDate = new Date(issueDate);

    // One month borrowing period
    dueDate.setMonth(dueDate.getMonth() + 1);

    return dueDate;
}

async function validateUserId(
    userId: string,
    session?: ClientSession
): Promise<void> {
    if (!userId) {
        throw new AppError(
            "User ID is required",
            400
        );
    }
    
    const user = await findUserByID(
        userId,
        session
    );


    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }
}

async function validateCopyId(
    copyId: string,
    session?: ClientSession
): Promise<void> {

    if (!copyId) {
        throw new AppError(
            "Book Copy ID is required",
            400
        );
    }

    const bookCopy = await findBookCopyByID(
        copyId,
        session
    );

    if (!bookCopy) {
        throw new AppError(
            "Book Copy not found",
            404
        );
    }

    if (bookCopy.status !== "available") {
        throw new AppError(
            "Book Copy is not available",
            400
        );
    }
}

async function findUserByID(
    userId: string,
    session?: ClientSession
): Promise<HydratedDocument<IUser> | null> {
    return await userModel.findOne({
    userId: userId
    }).session(session ?? null);
}

async function findBookCopyByID(
    copyId: string,
    session?: ClientSession
): Promise<HydratedDocument<IBookCopy> | null> {

    return await BookCopyModel
        .findById(copyId)
        .session(session ?? null);
}

export async function countBorrowedBooks(userId : string, session? : ClientSession): Promise<number>{
    return BorrowModel.countDocuments({
        userId,
        status: "issued",
    }).session(session ?? null);
}

export async function getReturnDeadline(
    userId: string,
    session?: ClientSession
): Promise<Date | null> {

    const borrow = await BorrowModel
        .findOne({
            userId,
            status: "issued",
        })
        .sort({ dueDate: 1 })
        .session(session ?? null);

    if (!borrow) {
        return null;
    }

    return borrow.dueDate;
}

export async function countTodaysBorrowedBooks(session? : ClientSession): Promise<number> {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    //we didn't put +1 here because currently it's dealing with miliseconds so it would just add 1 in milliseconds
    const startOfTomorrow = new Date(startOfToday);

    startOfTomorrow.setDate(
        startOfTomorrow.getDate() + 1
    );

    return BorrowModel.countDocuments({
        status: "issued",

        issueDate: {
            $gte: startOfToday,
            $lt: startOfTomorrow
        },

    }).session(session ?? null);
}

export async function countTodaysReturns(session? : ClientSession): Promise<number> {

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    //we didn't put +1 here because currently it's dealing with miliseconds so it would just add 1 in milliseconds
    const startOfTomorrow = new Date(startOfToday);

    startOfTomorrow.setDate(
        startOfTomorrow.getDate() + 1
    );

    return BorrowModel.countDocuments({
        status: "returned",

        issueDate: {
            $gte: startOfToday,
            $lt: startOfTomorrow
        },

    }).session(session ?? null);

}

export async function countOverdueBooks(session? : ClientSession): Promise<number> {
    return BorrowModel.countDocuments({
        status : "issued",
        dueDate : {
            $lt : new Date()
        }
    }).session(session ?? null);
}

export async function countLostBooks(session? : ClientSession): Promise<number> {
    return BorrowModel.countDocuments({
        status : "lost"
    }).session(session ?? null);
}

export async function getRecentlyBorrowedBooks(session? : ClientSession): Promise<LibrarianBorrowCard[]> {

    const borrows = await BorrowModel
        .find({
            status: "issued",
        }).populate("userId", "userId name rollNumber employeId")
        .populate({
            path: "copyId",
            populate: {
                path: "bookId",
            },
        })
        .session(session ?? null)
        .sort({
            issueDate: -1,
        })
        .limit(10) as unknown as PopulatedBorrow[];

    return borrows.map((borrow) => {

        const copy = borrow.copyId;
        const book = copy.bookId;
        const user = borrow.userId;

        return {
            borrowId: borrow._id.toString(),
            userId: user.userId.toString(),
            userName: user.name,
            rollNumber: user.rollNumber,
            emploteId: user.employeId,
            copyId: copy._id.toString(),
            accessionNumber: copy.accessionNumber,
            title: book.title,
            author: book.author,
            dueDate: borrow.dueDate,
            borrowedOn: borrow.issueDate,
        };
    });
}

export async function getTodaysBorrowedBooks(session? : ClientSession ): Promise<LibrarianBorrowCard[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const borrows = await BorrowModel
        .find({
            issueDate: {
                $gt : startOfToday,
                $lt : startOfTomorrow
            }
        }).populate("userId", "userId name rollNumber employeId")
        .populate({
            path: "copyId",
            populate: {
                path: "bookId",
            },
        })
        .session(session ?? null)
        .sort({
            issueDate: -1,
        })
        .limit(10) as unknown as PopulatedBorrow[];

    return borrows.map((borrow) => {

        const copy = borrow.copyId;
        const book = copy.bookId;
        const user = borrow.userId;

        return {
            borrowId: borrow._id.toString(),
            userId: user.userId.toString(),
            userName: user.name,
            rollNumber: user.rollNumber,
            emploteId: user.employeId,
            copyId: copy._id.toString(),
            accessionNumber: copy.accessionNumber,
            title: book.title,
            author: book.author,
            dueDate: borrow.dueDate,
            borrowedOn: borrow.issueDate,
        };
    });
}