import { z } from "zod";

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const fineStatusSchema = z.enum([
    "pending",
    "settled",
    "waived",
]);

export const fineReasonSchema = z.enum([
    "late_return",
    "lost_book",
    "damage",
]);

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const getFineByBorrowIdSchema = z.object({
    params: z.object({
        borrowId: objectId,
    }),
});

export const getPendingFinesSchema = z.object({
    query: paginationSchema.extend({
        userId: objectId.optional(),
        reason: fineReasonSchema.optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
    }),
});

export const getFineHistorySchema = z.object({
    query: paginationSchema.extend({
        status: fineStatusSchema.optional(),
        userId: objectId.optional(),
        reason: fineReasonSchema.optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
    }),
});

export const waiveFineSchema = z.object({
    params: z.object({
        fineId: objectId,
    }),

    body: z.object({
        remarks: z
            .string()
            .trim()
            .min(1, "Remarks are required.")
            .max(500),
    }),
});

export const payFineByCashSchema = z.object({
    params: z.object({
        fineId: objectId,
    }),

    body: z.object({
        remarks: z
            .string()
            .trim()
            .max(500)
            .optional(),
    }),
});

export const payFineByUPISchema = z.object({
    params: z.object({
        fineId: objectId,
    }),

    body: z.object({}).optional(),
});