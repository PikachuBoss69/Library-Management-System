import { Schema, model } from "mongoose";

export interface IStudentRegistry {
    rollNumber: string;
    fullName: string;
    collegeEmail: string;
    phoneNumber: number;
    dateOfBirth: Date;
    fatherName: string;
    motherName: string;
    parentPhoneNumber: number;
    course: string;
    branch: string;
    year: number;
    permanentAddress: string;
    residentialAddress: string;
    status: string;
}

const studentRegistrySchema = new Schema<IStudentRegistry>(
    {
        rollNumber: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        collegeEmail: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: Number,
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
        parentPhoneNumber: {
            type: Number,
            required: true,
        },
        course: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        permanentAddress: {
            type: String,
            required: true,
        },
        residentialAddress: {
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

export const StudentRegistry = model<IStudentRegistry>(
    "StudentRegistry",
    studentRegistrySchema,
    "studentRegistries"
);