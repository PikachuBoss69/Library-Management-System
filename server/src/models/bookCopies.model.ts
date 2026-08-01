import { Schema, model, Types } from "mongoose";

export interface IBookCopy {
    bookId: Types.ObjectId;

    accessionNumber: string;

    status: "available" | "borrowed" | "reserved" | "lost";

    condition: "new" | "good" | "damaged";

    purchaseDate: Date;

    price: number;
}

const bookCopySchema = new Schema<IBookCopy>(
    {
        bookId: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        accessionNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["available", "borrowed", "reserved", "lost"],
            default: "available",
        },
        condition: {
            type: String,
            enum: ["new", "good", "damaged"],
            default: "new",
        },
        purchaseDate: {
            type: Date,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const BookCopyModel = model<IBookCopy>("BookCopy", bookCopySchema);