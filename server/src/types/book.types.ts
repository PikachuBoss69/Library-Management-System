import { IBook } from "../models/books.model";

export type BookParams = {
    bookId: string;
}
export type BookCopyParams = {
    bookId : string;
    copyId : string
}

export interface BookQuery {
    page : number;
    limit : number;
    category : string;
    search : string;
}

export interface GetAllBooksResponse {
    books: IBook[];
    total: number;
    page: number;
    limit: number;
}