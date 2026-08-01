
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                  BOOKS                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                               BOOK COPIES                                  */
/* -------------------------------------------------------------------------- */

export const createBookCopySchema = z.object({
    params: z.object({
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),
    }),

    body: z.object({
        accessionNumber: z.string().trim().min(1),

        // No status field.
        // Every newly created copy is "available" by default in the model.
        condition: z.enum(["new", "good", "damaged"]),

        purchaseDate: z.coerce.date(),

        price: z.number().nonnegative().optional(),
    }),
});

export const getBookCopiesSchema = z.object({
    params: z.object({
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),
    }),
});

export const getBookCopySchema = z.object({
    params: z.object({
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),

        copyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Copy ID"),
    }),
});

export const updateBookCopySchema = z.object({
    params: z.object({
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),

        copyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Copy ID"),
    }),

    body: z.object({
        // Status should NOT be updated here.
        // Borrow/Return/Lost should have dedicated endpoints.
        condition: z.enum(["new", "good", "damaged"]).optional(),

        price: z.number().nonnegative().optional(),
    }),
});

export const deleteBookCopySchema = z.object({
    params: z.object({
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),

        copyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Copy ID"),
    }),
});
