import {BookModel} from '../models/books.model';
import { BookCopyModel } from '../models/bookCopies.model';
import {Request, Response, NextFunction } from "express";
import {AppError} from "../utils/AppError";
import * as bookCopyService from '../services/bookCopy.service';
import {BookParams, BookCopyParams} from '../types/book.types';

export async function addBookCopies(req: Request<BookParams>, res: Response): Promise<void>{
    try{
        const { bookId } = res.locals.validated.params;

        const {accessionNumber, purchaseDate, price, condition} = req.body ;  

        const book = await BookModel.findById(bookId);

        if (!book) {
            throw new AppError("Book not found", 404);
        }

        const bookcopy = await BookCopyModel.create({bookId, accessionNumber, purchaseDate, price, condition});
       
        await BookModel.findByIdAndUpdate(
            bookId,
            {
                $inc: {
                    totalCopies: 1,
                    availableCopies: 1,
                },
            }
        );

        res.status(200).json({
            message : "",
            bookCopy : {
                bookId : bookcopy.bookId,
                accessionNumber : bookcopy.accessionNumber, 
                status : bookcopy.status, 
                condition : bookcopy.condition, 
                purchaseDate : bookcopy.purchaseDate, 
                price : bookcopy.price
            },
            status : "Success",
        })
    }catch(error){
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError(
            "Internal Server Error",
            500
        );
    } 
    
}

export async function getAllBookCopies(req: Request<BookParams>, res: Response, next: NextFunction): Promise<void> {
    try {
        const { bookId } = res.locals.validated.params;
        const copies = await BookCopyModel.find({ bookId });

        res.status(200).json({
            success: true,
            message: "Book copies fetched successfully",
            data: copies,
        });
    } catch (error) {
        next(new AppError("Internal Server Error", 500));
    }
}

export async function getBookCopyDetails(req: Request<BookCopyParams>, res: Response, next: NextFunction): Promise<void> {
    try {
        const { copyId } = res.locals.validated.params;

        const copy = await BookCopyModel.findById(copyId);
        if (!copy) {
            throw new AppError("Book copy not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Book copy fetched successfully",
            data: copy,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError("Internal Server Error", 500));
    }
}

export async function updateBookCopy(req: Request<BookCopyParams>, res: Response, next: NextFunction): Promise<void> {
    try {
        const { copyId } = res.locals.validated.params;
        const {condition, price } = req.body;

        const copy = await BookCopyModel.findById(copyId);
        if (!copy) {
            throw new AppError("Book copy not found", 404);
        }

        if (condition !== undefined) copy.condition = condition;
        if (price !== undefined) copy.price = price;

        await copy.save();

        res.status(200).json({
            success: true,
            message: "Book copy updated successfully",
            data: copy,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError("Internal Server Error", 500));
    }
}

export async function deleteBookCopy(req: Request<BookCopyParams>, res: Response, next: NextFunction): Promise<void> {
    try {
        const { copyId } = res.locals.validated.params;

        const copy = await BookCopyModel.findById(copyId);
        if (!copy) {
            throw new AppError("Book copy not found", 404);
        }

        if (copy.status === "borrowed") {
            throw new AppError("Cannot delete a copy that is currently borrowed", 409);
        }

        const book = await BookModel.findById(copy.bookId);
        if (book) {
            book.totalCopies = Math.max(book.totalCopies - 1, 0);
            if (copy.status === "available") {
                book.availableCopies = Math.max(book.availableCopies - 1, 0);
            }
            await book.save();
        }

        await copy.deleteOne();

        res.status(200).json({
            success: true,
            message: "Book copy deleted successfully",
            data: null,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError("Internal Server Error", 500));
    }
}


