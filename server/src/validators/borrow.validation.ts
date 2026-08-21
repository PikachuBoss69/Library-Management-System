import { z } from "zod";

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});


export const borrowBookSchema = z.object({
    body: z.object({
        userId: z.coerce.string(),

        copyId: objectId,
    }),
});

export const returnBookSchema = z.object({
    body: z.object({
        copyId: objectId,
    }),
});


export const reportLostBookSchema = z.object({
    body: z.object({
        copyId: objectId,
    }),
});


export const getBorrowRecordSchema = z.object({
    params: z.object({
        borrowId: objectId,
    }),
});


export const getAllBorrowedBooksSchema = z.object({
    query :
    paginationSchema.extend({
        userId: z.coerce.string().optional(),
        copyId: objectId.optional(),
        status: z.enum(["issued", "returned", "lost"]).optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
    })
    
})



export const getOverdueBooksSchema = z.object({
    query :
    paginationSchema.extend({
        userId: z.coerce.string().optional(),
        copyId: objectId.optional(),
        status: z.enum(["issued", "returned", "lost"]),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
    })
    
})