import {Request, Response} from "express";
import {AppError} from "../utils/AppError";
import * as bookService from '../services/book.service';
import {BookParams} from '../types/book.types';


export async function addNewBook(req: Request, res: Response): Promise<void>{
    try{
        const body = res.locals.validated.body;
       
        const book = await bookService.createBook(body);
        
     
        res.status(200).json({
            message : "Book Created Successfully",
            book : {
                title : book.title,
                author : book.author, 
                isbn : book.isbn, 
                category : book.category, 
                publicationYear : book.publicationYear, 
                language : book.language, 
                description : book.description, 
                totalCopies : book.totalCopies, 
                availableCopies : book.availableCopies,
            },
            status : "Success",
        });
    }catch(error: any){
        if (error instanceof AppError) {
            throw error;
        }
        if (error.code === 11000){
            throw new AppError("Book with this ISBN already exists", 409);
        } 
        throw new AppError(
            "Internal Server Error",
            500
        );
    }

}

export async function getBookDetails(req: Request<BookParams>, res: Response): Promise<void> {
    try {
        const { bookId } = res.locals.validated.params;

        const book = await bookService.getBookById(bookId);

        res.status(200).json({
            success: true,
            message: "Book details fetched successfully",
            data: book ,
        });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Internal Server Error", 500);
    }
}

export async function updateBook(req: Request<BookParams>, res: Response): Promise<void> {
    try {
        const { bookId } = res.locals.validated.params;
        const body = res.locals.validated.body;
       const book = await bookService.updateBook(bookId, body );
       
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });

    } catch (error: any) {
        if (error instanceof AppError) throw error;
        if (error.code === 11000) throw new AppError("Book with this ISBN already exists", 409);
        throw new AppError("Internal Server Error", 500);
    }
}

export async function deleteBook(req: Request<BookParams>, res: Response): Promise<void> {
    try {
        const { bookId } = res.locals.validated.params;;

        await bookService.deleteBook(bookId);

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Internal Server Error", 500);
    }
}

export async function getAllBook(req: Request, res: Response): Promise<void> {
    try {
        const query = res.locals.validated.query;

        const result = await bookService.getAllBooks(query);
        

        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: result.books,

            // Pagination information for frontend.
            meta: {
                page: result.page,
                limit: result.limit,
                total : result.total,
                pages: Math.ceil(result.total / result.limit),
            },
        });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Internal Server Error", 500);
    }
}