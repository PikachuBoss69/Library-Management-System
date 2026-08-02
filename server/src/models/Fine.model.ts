import {Schema, model, Types} from 'mongoose';

export interface IFine {
    borrowId: Types.ObjectId;
    studentId: Types.ObjectId;
    amount: number;
    reason: string;
    status: "settled" | "pending" | "waived";
    paidDate?: Date;
    waivedDate?: Date;
    waivedBy?: Types.ObjectId;
}

const FineSchema = new Schema<IFine>(
    {
        borrowId: {
            type: Schema.Types.ObjectId,
            ref: "Borrow",
            required: true,
        },
        studentId :{
            type : Types.ObjectId,
            ref : "User",
            required : true,
        },
        amount: {
            type: Number,
            required: true,
        },

        reason: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["settled", "pending", "waived"],
            default: "pending",
            required: true,
        },

        paidDate: {
            type: Date,
        },

        waivedDate: {
            type: Date,
        },

        waivedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {timestamps: true}
);

export const FineModel = model<IFine>("Fine", FineSchema);