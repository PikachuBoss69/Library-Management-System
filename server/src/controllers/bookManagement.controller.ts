import {BookModel} from '../models/books.model';
import { BookCopyModel } from '../models/bookCopies.model';
import {Request, Response, NextFunction } from "express";
import {AppError} from "../utils/AppError";


type BookParams = {
    bookId: string;
}
type BookCopyParams = {
    bookId : string;
    copyId : string
}


export async function addNewBook(req: Request, res: Response): Promise<void>{
    try{
      
        const { title, author, isbn, category, publicationYear, language, description, totalCopies} = req.body;
    
        const book = await BookModel.create({title, author, isbn, category, publicationYear, language, description, totalCopies: totalCopies ?? 0, availableCopies: totalCopies ?? 0});
     
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

export async function getBookDetails(req: Request<BookParams>, res: Response): Promise<void> {
    try {
        const { bookId } = res.locals.validated.params;

        const book = await BookModel.findById(bookId);
        if (!book) {
            throw new AppError("Book not found", 404);
        }

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

        const { title, author, isbn, category, publicationYear, language, description } = req.body;

        const book = await BookModel.findByIdAndUpdate(
            bookId,
            { title, author, isbn, category, publicationYear, language, description },
            { new: true, runValidators: true }
        );

        if (!book) {
            throw new AppError("Book not found", 404);
        }

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

        const activeCopies = await BookCopyModel.countDocuments({ bookId, status: "borrowed" });
        if (activeCopies > 0) {
            throw new AppError("Cannot delete book with copies currently borrowed", 409);
        }

        const book = await BookModel.findByIdAndDelete(bookId);
        if (!book) {
            throw new AppError("Book not found", 404);
        }

        await BookCopyModel.deleteMany({ bookId });

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
        
        const { page = "1", limit = "10", category, search } = req.query;

        
        const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit as string, 10) || 10, 1);

        // Record<string, unknown> is an index signature.
        // It means this object can have ANY string key added dynamically.
        // Example:
        // filter.category = "Programming"
        // filter.$or = [...]
        const filter: Record<string, unknown> = {};

        if (category) filter.category = category;

        if (search) {
            // $or => Return documents if ANY condition is true.
            // $regex => Pattern matching (contains search).
            // $options: "i" => Case-insensitive search.
            // Example:
            // search="clean"
            // Matches: "Clean Code", "clean code", "CLEAN CODE"
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
                { isbn: { $regex: search, $options: "i" } },
            ];
        }

        // Promise.all() executes independent database queries in parallel.
        // This is faster than awaiting one after another.
        const [books, total] = await Promise.all([
            BookModel.find(filter)
                // Skip books from previous pages.
                .skip((pageNum - 1) * limitNum)

                // Maximum books returned in one page.
                .limit(limitNum)

                // -1 => Descending order (newest first).
                .sort({ createdAt: -1 }),

            // Total matching documents (used for pagination).
            BookModel.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: books,

            // Pagination information for frontend.
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Internal Server Error", 500);
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


