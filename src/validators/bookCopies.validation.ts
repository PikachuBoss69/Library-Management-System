import { z } from "zod";

export const createBookSchema = z.object({
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

