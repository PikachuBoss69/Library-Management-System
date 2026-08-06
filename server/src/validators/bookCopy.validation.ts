import { z } from "zod";

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
