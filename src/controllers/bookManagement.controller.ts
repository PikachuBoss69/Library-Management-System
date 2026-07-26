import {BookModel} from '../models/books.model';
import { BookCopyModel } from '../models/bookCopies.model';
import {createBookSchema} from '@/validators/book.validation';
import jwt from "jsonwebtoken";
import {Request, Response } from "express";
import {AppError} from "../utils/AppError";

interface BookParams {
    bookId: string;
}


export async function addNewBook(req: Request, res: Response): Promise<void>{
    try{

        const { title, author, isbn, category, publicationYear, language, description, totalCopies, availableCopies} = req.body;
        
        const book = await BookModel.create({title, author, isbn, category, publicationYear, language, description, totalCopies, availableCopies});
        
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
    }catch(error){
        if (error instanceof AppError) {
        throw error;
        }

        throw new AppError(
            "Internal Server Error",
            500
        );
    }

}

export async function addBookCopies(req: Request<BookParams>, res: Response): Promise<void>{
    try{
        const { bookId } = req.params;

        const {accessionNumber, purchaseDate, price, availableCopies} = req.body ;  

        const book = await BookModel.findById(bookId);

        if (!book) {
            throw new AppError("Book not found", 404);
        }

        const bookcopy = await BookCopyModel.create({bookId, accessionNumber, purchaseDate, price});
       
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

export async function getBookDetails(req: Request, res: Response): Promise<void>{

}

export async function updateBook(req: Request, res: Response): Promise<void>{

}

export async function getAllBook(req: Request, res: Response): Promise<void>{

}