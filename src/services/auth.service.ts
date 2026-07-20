import {IUserDocument, userModel} from "../models/users.model";
import jwt from "jsonwebtoken";
import {sendingEmailOtp, sendingEmailPassword} from "./nodemailer.service"
import {sendSms} from "./twilo.service";
import {Request, Response } from "express";
import {randomInt} from "node:crypto";

import { AppError } from "../utils/AppError";



const secretKey = process.env.JWT_SECRET_KEY; 
export async function generatePassword() : Promise<string> {
    // Implementation for generating a random password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomPassword = ""; // Generates a random 8-character password
    for (let i = 0; i < 8; i++) {
        randomPassword += characters[randomInt(characters.length)];
    }
    return randomPassword;
}

export async function createUser( rollNumber: string, password: string, role: "student" ) : Promise<IUserDocument> {
    const user = await userModel.create({ rollNumber, password, role });

   
    user.userId = `STU${rollNumber}`; 
    
    await user.save();
    
    return user;
}

export function compareOtps(userOtp: number, generatedOtp: number): boolean {
    if(userOtp == generatedOtp){
        return true;
    }
    return false;
}

//Geneates a random 6-digit OTP for email and phone verification
export async function generateOtp() : Promise<number> {
    return Math.floor(Math.random() * 900000) + 100000;
}

export async function generateToken(user: any) : Promise<string> {

    if (!secretKey) {
        throw new AppError("JWT_SECRET is missing",400);
    }
    return jwt.sign({ userId: user._id }, secretKey, { expiresIn: "3d" });

}

export async function verifyToken(token: string) {
    if (!secretKey) {
        throw new AppError("JWT_SECRET is missing",400);
    }
    return jwt.verify(token, secretKey);
}

export async function sendEmailOtp(email : string, otp: number) : Promise<void> {
    await sendingEmailOtp(email, otp);
} 

export async function sendPhoneOtp(phoneNumber: string, otp: number) : Promise<void> {
    await sendSms(phoneNumber, otp);
}

export async function sendPasswordEmail(email: string, password: string) : Promise<void> {
    await sendingEmailPassword(email, password);
}

export async function changepassword(user : any, newPassword : string) : Promise<void>{

                const isSamePassword : boolean = await user.comparePassword(newPassword);
        
                if (isSamePassword) {
                    throw new AppError("New password is Same as Previous Password", 409);
                }
        
                user.password = newPassword;
                user.isFirstLogin = false;
        
                await user.save();

                return ;
}