import { Schema, model } from "mongoose";

export interface IBook {
    title: string;
    author: string;
    isbn: string;
    category: string;
    publicationYear: Date;
    language: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
}

const bookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        isbn: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        publicationYear: {
            type: Date,
            required: true,
        },
        language: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        totalCopies: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        availableCopies: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const BookModel = model<IBook>("Book", bookSchema);