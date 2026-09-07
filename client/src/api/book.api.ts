import {api} from "./axios";

export interface Book {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    publicationYear: Date;
    language: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
}

export interface BookResponse {
    success: boolean;
    message: string;

    data: Book[];

    meta: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface BookQuery {
    page: number;
    limit: number;
    search?: string;
    category?: string;
}

export async function getAllBooks(
    query: BookQuery
): Promise<BookResponse> {
    try {
        const response = await api.get("/book", {
            params: query,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
}