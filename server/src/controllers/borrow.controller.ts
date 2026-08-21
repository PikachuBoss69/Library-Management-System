import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { issueBook, updateBookDetails, returnIssuedBook, reportLostBorrow, getBorrowById, getActiveBorrowedBooks, getBorrowHistory, get_OverdueBooks, get_AllBorrowedBooks} from "../services/borrow.service";
import { BorrowQuery } from "../types/borrow.types";
import { BookCopyModel } from "../models/bookCopies.model";

export async function borrowBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { userId, copyId } = req.body;

        const issuedBy = req.user!._id;

        const bookCopy = await BookCopyModel
            .findById(copyId)
            .populate("bookId", "availableCopies");

        if (!bookCopy) {
            throw new AppError("Book copy not found", 404);
        }

        if (bookCopy.status !== "available") {
            throw new AppError("This book copy is not available", 400);
        }
        const book = bookCopy.bookId as unknown as {
            availableCopies: number;
        };

        if (book.availableCopies < 1) {
            throw new AppError("No copies of this book are currently available", 400);
        }
        const borrowRecord = await issueBook(userId, copyId, issuedBy);


        res.status(201).json({
            success: true,
            message: "Book issued successfully",
            data: borrowRecord,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            throw new AppError(error.message, error.statusCode);
        }
        else{
            next(new AppError("Failed to issue book", 500));
        }
    }
}
export async function returnBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { copyId } = req.body;

        const receivedBy = req.user!._id;

        const borrowRecord = await returnIssuedBook(copyId, receivedBy);
        await updateBookDetails(copyId, "available");

        res.status(200).json({
            success: true,
            message: "Book returned successfully",
            data: borrowRecord,
        });
    } catch (error) {
        console.log(error);
        next(new AppError("Failed to return book", 500));
    }
}

export async function reportLostBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { copyId } = req.body;

        const borrowRecord = await reportLostBorrow(copyId);
        await updateBookDetails(copyId, "lost");

        res.status(200).json({
            success: true,
            message: "Book marked as lost",
            data: borrowRecord,
        });
    } catch (error) {
       
        next(new AppError("Failed to report lost book", 500));
    }
}

export async function getBorrowRecordById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { borrowId } = res.locals.validated.params;
        if (!borrowId) {
            throw new AppError("Borrow ID is required", 400);
        }
        const borrowRecord = await getBorrowById(borrowId);

        res.status(200).json({
            success: true,
            message: "Borrow record fetched successfully",
            data: borrowRecord,
        });
    } catch (error) {
        next(new AppError("Failed to fetch borrow record", 500));
    }
}

export async function getMyBorrowedBooks(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        
        const userId = req.user!.userId;
        const borrowedBooks = await getActiveBorrowedBooks(userId.toString());
        res.status(200).json({
            success: true,
            message: "Borrowed books fetched successfully",
            data: borrowedBooks,
        });
    } catch (error) {
        next(new AppError("Failed to fetch borrowed books", 500));
    }
}

export async function getMyBorrowHistory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.user!.userId;

        const history = await getBorrowHistory(userId.toString());

        res.status(200).json({
            success: true,
            message: "Borrow history fetched successfully",
            data: history,
        });
    } catch (error) {
        next(new AppError("Failed to fetch borrow history", 500));
    }
}



export async function getAllBorrowedBooks(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const query = res.locals.validated.query;

        const borrows = await get_AllBorrowedBooks(query);

        res.status(200).json({
            success: true,
            message: "Borrowed books fetched successfully.",
            data: borrows,
        });

    } catch (error) {
        next(error);
    }
}

export async function getOverdueBooks(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const query : BorrowQuery = res.locals.validated.query;

        const borrows = await get_OverdueBooks(query);

        res.status(200).json({
            success: true,
            message: "Overdue books fetched successfully.",
            data: borrows,
        });

    } catch (error) {
        next(error);
    }
}
