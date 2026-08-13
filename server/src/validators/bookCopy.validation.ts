import { z } from "zod";

export const bookCopySchema = z.object({
    body: z.object({
        bookId: z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid book ID"
        ),

        accessionNumber: z.string()
            .min(1, "Accession number is required")
            .trim(),

        condition: z.enum(["new", "good", "damaged"]),

        purchaseDate: z.coerce.date(),

        price: z.coerce.number()
            .nonnegative("Price cannot be negative").optional(),
    }),
});


export const addBulkCopiesSchema = z.object({
    body: z.array(bookCopySchema)
        .min(1, "At least one book copy is required"),
});


export const getBookCopiesSchema = z.object({
    params: z.object({
        bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),
    }),
});

export const getBookCopySchema = z.object({
    params: z.object({
        copyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Copy ID"),
    }),
});

export const updateBookCopySchema = z.object({
    params: z.object({

        copyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Copy ID"),
    }),

    body: z.object({
        // Status should NOT be updated here.
        // Borrow/Return/Lost should have dedicated endpoints.
        condition: z.enum(["new", "good", "damaged"]).optional(),

        price: z.coerce.number().nonnegative().optional(),
    }),
});

export const deleteBookCopySchema = z.object({
    params: z.object({
        copyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Copy ID"),
    }),
});
