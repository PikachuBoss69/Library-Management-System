import { IBorrow } from "@/models/Borrow.model";
import { HydratedDocument, Types } from "mongoose";
import { PopulatedBookCopy } from "./bookCopy.types";

export interface BorrowQuery {
    page?: number;
    limit?: number;
    userId?: string;
    copyId?: string;
    status?: "issued" | "returned" | "lost";
    from?: string;
    to?: string;
}

export interface BorrowFilter {
    userId?: string;
    copyId?: string;
    status?: "issued" | "returned" | "lost";
    dueDate?: {
        $lt?: Date;
    };
    borrowDate?: {
        $gte?: Date;
        $lte?: Date;
    };
}

export interface PopulatedUser {
    userId: string;
    name: string;
    rollNumber? : string;
    employeId? : string;
}

export type PopulatedBorrow = Omit<HydratedDocument<IBorrow>, "copyId" | "userId"> & {
    copyId: PopulatedBookCopy;
    userId: PopulatedUser;
};