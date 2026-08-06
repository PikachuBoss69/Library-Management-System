
import { z } from "zod";

export const createBookSchema = z.object({
    body: z.object({
        title: z.string().trim().min(1),

        author: z.string().trim().min(1),

        isbn: z.string().trim().min(10),

        category: z.string().trim().min(1),

        // Automatically converts a string into a JavaScript Date object
        publicationYear: z.coerce.date(),

        language: z.string().trim().min(1),

        description: z.string().trim().optional(),

        totalCopies: z.number().int().nonnegative(),
    }),
});

export const getBookSchema = z.object({
    params: z.object({
        // MongoDB ObjectId
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),
    }),
});

export const updateBookSchema = z.object({
    params: z.object({
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),
    }),

    body: z.object({
        title: z.string().trim().min(1).optional(),

        author: z.string().trim().min(1).optional(),

        isbn: z.string().trim().min(10).optional(),

        category: z.string().trim().min(1).optional(),

        publicationYear: z.coerce.date().optional(),

        language: z.string().trim().min(1).optional(),

        description: z.string().trim().optional(),
    }),
});

export const deleteBookSchema = z.object({
    params: z.object({
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),
    }),
});

export const getAllBooksSchema = z.object({
    query: z.object({
        // Query parameters arrive as strings.
        // z.coerce.number() converts them into numbers automatically.
        page: z.coerce.number().int().positive().optional(),

        limit: z.coerce.number().int().positive().optional(),

        category: z.string().trim().optional(),

        search: z.string().trim().optional(),
    }),
});



