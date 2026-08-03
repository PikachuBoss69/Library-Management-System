import {Schema, model, Types} from 'mongoose';

export interface IFine {
    borrowId: Types.ObjectId;
    studentId: Types.ObjectId;
    amount: number;
    reason: string;
    status: "settled" | "pending" | "waived";
    paidDate?: Date;
    paymentMethod?: "cash" | "upi";
    waivedDate?: Date;
    settledBy?: Types.ObjectId;
    remarks?: string;
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
        paymentMethod : {
            enum : ["cash", "upi"],
            type : String,
        },

        waivedDate: {
            type: Date,
        },

        settledBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        remarks :{
            type: String,
        }
    },
    {timestamps: true}
);

export const FineModel = model<IFine>("Fine", FineSchema);