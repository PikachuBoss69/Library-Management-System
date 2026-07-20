import { Schema, model } from "mongoose";

export interface IStaffRegistry {
    employeId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    fatherName: string;
    motherName: string;
    dateOfJoining: Date;
    designation: string;
    department : string;
    status: string;
}

const staffRegistrySchema = new Schema<IStaffRegistry>(
    {
        employeId: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        fatherName: {
            type: String,
            required: true,
        },
        motherName: {
            type: String,
            required: true,
        },
        dateOfJoining: {
            type: Date,
            required: true,
        },

        department : {
            type : String,
            required : true,
        },

        designation: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

export const StaffRegistry = model<IStaffRegistry>(
    "StaffRegistry",
    staffRegistrySchema,
    "staffRegistries"
);