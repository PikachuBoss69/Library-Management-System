import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { issueBook, updateBookDetails, returnIssuedBook, reportLostBorrow, getBorrowById, getActiveBorrowedBooks, getBorrowHistory } from "../services/borrow.service";

export async function borrowBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { studentId, copyId } = req.body;

        // Logged in librarian
        const issuedBy = req.user!._id;

        const borrowRecord = await issueBook(studentId, copyId, issuedBy);

        await updateBookDetails(copyId, "borrowed");

        res.status(201).json({
            success: true,
            message: "Book issued successfully",
            data: borrowRecord,
        });
    } catch (error) {
        next(new AppError("Failed to issue book", 500));
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
        const studentId = req.user!._id;

        const borrowedBooks = await getActiveBorrowedBooks(studentId.toString());

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
        const studentId = req.user!._id;

        const history = await getBorrowHistory(studentId.toString());

        res.status(200).json({
            success: true,
            message: "Borrow history fetched successfully",
            data: history,
        });
    } catch (error) {
        next(new AppError("Failed to fetch borrow history", 500));
    }
}