import {AppError} from "../utils/AppError";
import {BookModel, IBook} from '../models/books.model';
import { BookCopyModel } from "../models/bookCopies.model";
import { BookQuery, GetAllBooksResponse } from "../types/book.types";

export async function _addNewBook(title : string,
    author : string,
    isbn : string,
    category : string,
    publicationYear : Date,
    language : string,
    description : string,
    totalCopies : number
): Promise<IBook> {

    const book =  await BookModel.create({title, author, isbn, category, publicationYear, language, description, totalCopies: totalCopies ?? 0, availableCopies: totalCopies ?? 0});
    
    return book;
}

export async function _getBookDetails(bookId : string){
    const book = await BookModel.findById(bookId);
        if (!book) {
            throw new AppError("Book not found", 404);
        }
    return book;
}

export async function _updateBook(
    bookId : string,
    title : string,
    author : string,
    isbn : string,
    category : string,
    publicationYear : Date,
    language : string,
    description : string,
    ): Promise<IBook>{

    const book = await BookModel.findByIdAndUpdate(
            bookId,
            { title, author, isbn, category, publicationYear, language, description },
            { new: true, runValidators: true }
        );
    if (!book) {
            throw new AppError("Book not found", 404);
        }

    return book;
}

export async function _deleteBook(bookId : string): Promise<void>{
    const activeCopies = await BookCopyModel.countDocuments({ bookId, status: "borrowed" });
    if (activeCopies > 0) {
        throw new AppError("Cannot delete book with copies currently borrowed", 409);
    }

    const book = await BookModel.findByIdAndDelete(bookId);

    if (!book) {
        throw new AppError("Book not found", 404);
    
    }
    await BookCopyModel.deleteMany({ bookId });   
    
}
export async function _getAllBooks(
    query: BookQuery
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
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .sort({ createdAt: -1 }),

        BookModel.countDocuments(filter),
    ]);

    return {
        books,
        total,
        page: pageNumber,
        limit: limitNumber,
    };
}