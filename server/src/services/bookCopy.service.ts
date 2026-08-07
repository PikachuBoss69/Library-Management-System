import {AppError} from "../utils/AppError";
import {BookModel} from '../models/books.model';
import { BookCopyModel, IBookCopy } from '../models/bookCopies.model';
import { BookCopyBody } from "@/types/bookCopy.types";
import mongoose, { ClientSession } from "mongoose";

export async function addBookCopies(
    bookId: string,
    body: BookCopyBody,
    session? : ClientSession
): Promise<IBookCopy> {

    const ownSession = !session;

    if(!session){
        session = await mongoose.startSession();
        session.startTransaction();
    }
    try {

        const book = await BookModel.findById(bookId).session(session);

        if (!book) {
            throw new AppError("Book not found", 404);
        }

        const [bookCopy] = await BookCopyModel.create(
            [
                {
                    bookId,
                    ...body,
                },
            ],
            { session }
        );

        await BookModel.findByIdAndUpdate(
            bookId,
            {
                $inc: {
                    totalCopies: 1,
                    availableCopies: 1,
                },
            },
            { session }
        );
        if(ownSession){
            await session.commitTransaction();
        }

        return bookCopy;

    } catch (error) {
        if(ownSession){

            await session.abortTransaction();
        }

        throw error;

    } finally {
        if(ownSession){
            
            await session.endSession();
        }

    }
}

export async function getBookCopyDetails(copyId : string, session? : ClientSession): Promise<IBookCopy>{

    const copy = await BookCopyModel.findById(copyId).session(session ?? null);
    if (!copy) {
        throw new AppError("Book copy not found", 404);
    }
    return copy;
}

export async function updateBookCopy(copyId : string, body : BookCopyBody, session? : ClientSession): Promise<IBookCopy> {

     const copy = await BookCopyModel.findById(copyId).session(session ?? null);
    if (!copy) {
        throw new AppError("Book copy not found", 404);
    }

    if (body.condition !== undefined) copy.condition = body.condition;
    if (body.price !== undefined) copy.price = body.price;

    (await copy.save({session,}));

    return copy;
}


export async function deleteBookCopy(
    copyId: string,
    session? : ClientSession 
): Promise<void> {
    const ownSession = !session;

    if(!session){
        session = await mongoose.startSession();
        session.startTransaction();

    }

    try {

        const copy = await BookCopyModel
            .findById(copyId)
            .session(session);

        if (!copy) {
            throw new AppError(
                "Book copy not found",
                404
            );
        }

        if (copy.status === "borrowed") {
            throw new AppError(
                "Cannot delete borrowed copy",
                409
            );
        }

        await BookModel.findByIdAndUpdate(
            copy.bookId,
            {
                $inc: {
                    totalCopies: -1,
                    availableCopies:
                        copy.status === "available"
                            ? -1
                            : 0,
                },
            },
            { session }
        );

        await BookCopyModel.findByIdAndDelete(
            copyId,
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
            
            await session.endSession();
        }

    }

}