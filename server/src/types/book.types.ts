import { IBook } from "../models/books.model";
import { Types} from "mongoose"
export type BookParams = {
    bookId: string;
}

export interface BookQuery {
    page?: string;
    limit?: string;
    category?: string;
    search?: string;
}

export interface GetAllBooksResponse {
    books: IBook[];
    total: number;
    page: number;
    limit: number;
}

export interface BookBodyParams {
    title? : string;
    author? : string;
    isbn? : string;
    category? : string;
    publicationYear? : Date;
    language? : string;
    description? : string;
    totalCopies? : number;
}

export interface PopulatedBook {
    _id: Types.ObjectId;
    title: string;
    author: string;
}