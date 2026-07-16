import {userModel} from "../models/users.model";
import jwt from "jsonwebtoken";
import {sendingEmailOtp} from "./nodemailer.service"
import {sendSms} from "./twilo.service";
import {Request, Response } from "express";
import {randomInt} from "node:crypto";
import dotenv from "dotenv";

dotenv.config();


const secretKey = process.env.JWT_SECRET; 
export async function generatePassword() : Promise<string> {
    // Implementation for generating a random password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomPassword = ""; // Generates a random 8-character password
    for (let i = 0; i < 8; i++) {
        randomPassword += characters[randomInt(characters.length)];
    }
    return randomPassword;
}

export async function createUser(rollNumber: string, password: string, role: "student" | "librarian" | "admin") : Promise<any> {
    return userModel.create({ rollNumber, password, role });
}

export function compareOtps(userOtp: number, generatedOtp: number): boolean {
    return (userOtp === generatedOtp)
}

//Geneates a random 6-digit OTP for email and phone verification
export async function generateOtp() : Promise<number> {
    return Math.floor(Math.random() * 900000) + 100000;
}

export async function generateToken(user: any) : Promise<string> {
    if (!secretKey) {
    throw new Error("JWT_SECRET is missing");
    }
    return jwt.sign({ userId: user._id }, secretKey, { expiresIn: "3d" });

}

export async function verifyToken(token: string) {
    if (!secretKey) {
        throw new Error("JWT_SECRET is missing");
    }
    return jwt.verify(token, secretKey);
}

export async function sendEmailOtp(email : string, otp: number) : Promise<void> {
    await sendingEmailOtp(email, otp);
} 

export async function sendPhoneOtp(phoneNumber: number, otp: number) : Promise<void> {
    await sendSms(phoneNumber, otp);
}
