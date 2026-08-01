import {Schema, model, Types } from "mongoose";

export interface IBorrow {
    studentId: Types.ObjectId;
    copyId: Types.ObjectId;

    issueDate: Date;
    dueDate: Date;
    returnDate?: Date;
    lostDate?: Date;

    status: "issued" | "returned" | "lost";

    issuedBy: Types.ObjectId;
    receivedBy?: Types.ObjectId;
}

const BorrowSchema = new Schema<IBorrow>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        copyId: {
            type: Schema.Types.ObjectId,
            ref: "BookCopy",
            required: true,
        },

        issueDate: {
            type: Date,
            required: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        returnDate: {
            type: Date,
        },
        lostDate: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["issued", "returned", "lost"],
            default: "issued",
            required: true,
        },

        issuedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receivedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

export const BorrowModel = model<IBorrow>("Borrow", BorrowSchema);