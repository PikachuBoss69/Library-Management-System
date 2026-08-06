import { IBook } from "../models/books.model";

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