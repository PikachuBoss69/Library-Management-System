import { z } from "zod";

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");


export const borrowBookSchema = z.object({
    body: z.object({
        studentId: objectId,

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

export const getMyBorrowedBooksSchema = z.object({});

export const getBorrowHistorySchema = z.object({});