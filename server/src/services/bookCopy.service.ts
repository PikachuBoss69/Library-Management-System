import {AppError} from "../utils/AppError";
import {BookModel} from '../models/books.model';
import { BookCopyModel, IBookCopy } from '../models/bookCopies.model';
import { BookCopyBody, PopulatedBookCopy} from "../types/bookCopy.types";
import mongoose, { ClientSession } from "mongoose";

export async function addBulkCopies(body: BookCopyBody[], session? : ClientSession): Promise<PopulatedBookCopy[]>{
    
    const ownSession = !session;

    if(!session){
        session = await mongoose.startSession();
        session.startTransaction();
    }
    try{
        const copies = await BookCopyModel.insertMany(
            body,
            { session }
        );

        const populatedCopies = await BookCopyModel
            .find({
                _id: { $in: copies.map(copy => copy._id) }
        })
        .populate("bookId", "title")
        .session(session);

        if(ownSession){
            await session.commitTransaction();
        }

        return populatedCopies as unknown as PopulatedBookCopy[];

    }catch(error){
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

export async function addBookCopies(
    body: BookCopyBody,
    session? : ClientSession
): Promise<IBookCopy> {

    const ownSession = !session;

    if(!session){
        session = await mongoose.startSession();
        session.startTransaction();
    }
    try {
        const [bookCopy] = await BookCopyModel.create(
            [
                {
                    ...body
                },
            ],
            { session }
        );
        if(!bookCopy){
            throw new AppError("BookCopy not formed", 401);
        }
        await BookModel.findByIdAndUpdate(
            bookCopy.bookId,
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
        console.log(error);
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

export async function countIssuedBooks(session?: ClientSession): Promise<number> {
    return BookCopyModel.countDocuments({
        status : "borrowed",
    }).session(session ?? null);  
 }

export async function countLostCopies(session?: ClientSession): Promise<number>{
    return BookCopyModel.countDocuments({
        status : "lost",
    }).session(session ?? null);
}