import { Types } from "mongoose";
import { PopulatedBook } from "./book.types";
import {IBookCopy} from '../models/bookCopies.model';

export type BookCopyParams = {
    bookId? : string;
    copyId? : string
}

export interface BookCopyBody {
    accessionNumber? : string; 
    status? : "available" | "borrowed" | "reserved" | "lost"; 
    condition? :  "new" | "good" | "damaged";
    purchaseDate? : Date; 
    price? : number;
}

export interface PopulatedBookCopy extends Omit<IBookCopy, "bookId">{
    _id: Types.ObjectId;
    accessionNumber: string;
    bookId: PopulatedBook;
    title? : string;
}