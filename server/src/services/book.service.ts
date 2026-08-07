import { AppError } from "../utils/AppError";
import { BookModel, IBook } from "../models/books.model";
import { BookCopyModel } from "../models/bookCopies.model";
import {
    BookBodyParams,
    BookQuery,
    GetAllBooksResponse,
} from "../types/book.types";
import mongoose, { ClientSession } from "mongoose";

export async function createBook(
    body: BookBodyParams,
    session?: ClientSession
): Promise<IBook> {
    try {
        const [book] = await BookModel.create(
            [
                {
                    ...body,
                    totalCopies: body.totalCopies ?? 0,
                    availableCopies: body.totalCopies ?? 0,
                },
            ],
            { session }
        );

        return book;
    } catch (error: any) {
        if (error.code === 11000) {
            throw new AppError("Book with this ISBN already exists", 409);
        }

        throw error;
    }
}

export async function getBookById(
    bookId: string,
    session?: ClientSession
): Promise<IBook> {

    const book = await BookModel
        .findById(bookId)
        .session(session ?? null);

    if (!book) {
        throw new AppError("Book not found", 404);
    }

    return book;
}

export async function updateBook(
    bookId: string,
    body: BookBodyParams,
    session?: ClientSession
): Promise<IBook> {

    try {

        const book = await BookModel.findByIdAndUpdate(
            bookId,
            {
                ...body,
            },
            {
                new: true,
                runValidators: true,
                session,
            }
        );

        if (!book) {
            throw new AppError(
                "Book not found",
                404
            );
        }

        return book;

    } catch (error: any) {

        if (error.code === 11000) {
            throw new AppError(
                "Book with this ISBN already exists",
                409
            );
        }

        throw error;
    }

}

export async function deleteBook(
    bookId: string,
    session? : ClientSession
): Promise<void> {

    const ownSession = !session;

    if(!session){
        session = await mongoose.startSession();
        session.startTransaction();

    }
    try {


        const borrowedCopies =
            await BookCopyModel.countDocuments({
                bookId,
                status: "borrowed",
            }).session(session);

        if (borrowedCopies > 0) {
            throw new AppError(
                "Cannot delete borrowed books",
                409
            );
        }

        const deleted =
            await BookModel.findByIdAndDelete(
                bookId,
                { session }
            );

        if (!deleted) {
            throw new AppError(
                "Book not found",
                404
            );
        }

        await BookCopyModel.deleteMany(
            { bookId },
            { session }
        );
        if(ownSession){
            await session.commitTransaction();
        }

    } catch (error) {
        if(ownSession){
            
            await session.abortTransaction();
        }

        throw error;

    } finally {
        if(ownSession){
            
            session.endSession();
        }

    }

}

export async function getAllBooks(
    query: BookQuery,
    session?: ClientSession
): Promise<GetAllBooksResponse> {

    const {
        page = "1",
        limit = "10",
        category,
        search,
    } = query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    const filter: Record<string, unknown> = {};

    if (category) {
        filter.category = category;
    }

    if (search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                author: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                isbn: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const [books, total] = await Promise.all([

        BookModel.find(filter)
            .session(session ?? null)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .sort({
                createdAt: -1,
            }),

        BookModel.countDocuments(filter)
            .session(session ?? null),

    ]);

    return {
        books,
        total,
        page: pageNumber,
        limit: limitNumber,
    };
}