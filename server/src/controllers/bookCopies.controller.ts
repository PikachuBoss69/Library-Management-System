import {Request, Response, NextFunction } from "express";
import {AppError} from "../utils/AppError";
import * as bookCopyService from '../services/bookCopy.service';
import {BookCopyParams} from '../types/bookCopy.types';

export async function addBookCopies(req: Request<BookCopyParams>, res: Response): Promise<void>{
    try{
        const { bookId } = res.locals.validated.params;
        const body = res.locals.validated.body;

        const result = await bookCopyService.addBookCopies(bookId, body);

        res.status(200).json({
            message : "",
            bookCopy : {
                bookId : result.bookId,
                accessionNumber : result.accessionNumber, 
                status : result.status, 
                condition : result.condition, 
                purchaseDate : result.purchaseDate, 
                price : result.price
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

export async function getBookCopyDetails(req: Request<BookCopyParams>, res: Response, next: NextFunction): Promise<void> {
    try {
        const { copyId } = res.locals.validated.params;

        const result = await bookCopyService.getBookCopyDetails(copyId);

        res.status(200).json({
            success: true,
            message: "Book copy fetched successfully",
            data: result,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError("Internal Server Error", 500));
    }
}

export async function updateBookCopy(req: Request<BookCopyParams>, res: Response, next: NextFunction): Promise<void> {
    try {
        const { copyId } = res.locals.validated.params;
       const result = await bookCopyService.updateBookCopy(copyId, req.body);

        res.status(200).json({
            success: true,
            message: "Book copy updated successfully",
            data: result,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError("Internal Server Error", 500));
    }
}

export async function deleteBookCopy(req: Request<BookCopyParams>, res: Response, next: NextFunction): Promise<void> {
    try {
        const { copyId } = res.locals.validated.params;

        await bookCopyService.deleteBookCopy(copyId);

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


