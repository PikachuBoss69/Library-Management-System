import { z } from "zod";

export const createBookSchema = z.object({
    title: z.string().trim().min(1),
    author: z.string().trim().min(1),
    isbn: z.string().trim().min(10),
    category: z.string().trim().min(1),

    publicationYear: z.coerce.date(),

    language: z.string().trim().min(1),

    description: z.string().trim().optional(),

    totalCopies: z.number().int().nonnegative(),

    availableCopies: z.number().int().nonnegative(),
});

export const createBookCopySchema = z.object({
    body : z.object({

        accessionNumber: z.string().trim().min(1),
        
        status: z.enum(["available", "borrowed", "reserved", "lost"]),
        
        condition: z.enum(["new", "good", "damaged"]),
        
        purchaseDate: z.coerce.date(),

        price: z.number().nonnegative().optional(),
    }),

    params : z.object({
        bookId: z.string()
    })

});