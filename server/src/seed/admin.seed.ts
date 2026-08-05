import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDb } from "../config/mongoDb";
import { userModel } from "../models/users.model";

dotenv.config();

async function seedAdmin(): Promise<void> {
    try {

        await connectDb();

        console.log("Connected to database.");

        const existingAdmin = await userModel.findOne({
            role: "admin",
        });

        if (existingAdmin) {
            console.log("Admin already exists. Seeding skipped.");

            await mongoose.disconnect();
            process.exit(0);
        }

        const employeeId = process.env.ADMIN_EMPLOYEE_ID;
        const password = process.env.ADMIN_PASSWORD;

        if (!employeeId || !password) {
            throw new Error(
                "ADMIN_EMPLOYEE_ID or ADMIN_PASSWORD missing in .env"
            );
        }

        const admin = new userModel({
            employeeId,
            password,
            role: "admin",
            userId: `ADM${employeeId}`,
            isEmailVerified: true,
            isPhoneVerified: true,
            isFirstLogin: true,
        });

        await admin.save();

        console.log("Admin created successfully.");
        console.log(`User ID : ${admin.userId}`);

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {

        console.error("Admin seeding failed.");
        console.error(error);

        await mongoose.disconnect();

        process.exit(1);
    }
}

seedAdmin();