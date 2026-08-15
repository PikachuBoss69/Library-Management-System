import {IUserDocument, userModel} from "../models/users.model";
import jwt from "jsonwebtoken";
import {sendingEmailOtp, sendingEmailPassword} from "../config/nodemailer.service"
import {sendSms} from "../config/twilo.service";
import {randomInt} from "node:crypto";
import { AppError } from "../utils/AppError";
import { StaffRegistry } from "../models/staffRegistry.model";
import {OtpModel} from '../models/otp.model';
import { StudentRegistry } from "../models/studentRegistry.model";
import { ClientSession } from "mongoose";


const secretKey = process.env["JWT_SECRET_KEY"]; 
export async function generatePassword() : Promise<string> {
    // Implementation for generating a random password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomPassword = ""; // Generates a random 8-character password
    for (let i = 0; i < 8; i++) {
        randomPassword += characters[randomInt(characters.length)];
    }
    return randomPassword;
}

export async function createUser( rollNumber: string, password: string ) : Promise<IUserDocument> {
    const userId = `STU${rollNumber}`; 
    
    const user = await userModel.create({ userId, rollNumber, password});
 
    return user;
}

export async function createNewUser( employeId: string, password: string, role: "librarian" | "admin" ) : Promise<IUserDocument> {
    if (role === "admin") {
        await userModel.deleteOne({ role: "admin" });
    }

    const userId = role === "admin"
        ? `ADM${employeId}`
        : `LIB${employeId}`;

    const user = await userModel.create({userId, employeId, password, role});



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

export async function sendPasswordEmail(userId: string ,email: string, password: string) : Promise<void> {
    await sendingEmailPassword(userId, email, password);
}

export async function changepassword(user : any, newPassword : string) : Promise<void>{

    const isSamePassword : boolean = await user.comparePassword(newPassword);
    console.log(".......................2");
                if (isSamePassword) {
                    throw new AppError("New password is Same as Previous Password", 409);
                }
        
                user.password = newPassword;
                user.isFirstLogin = false;
        
                await user.save();

                return ;
}
export async function verifyCredentials(rollNumber: string) : Promise<void>  {
    const student = await StudentRegistry.findOne({
        rollNumber,
    });
    if (!student) {
        throw new AppError("Student not found", 404);
    }

    const emailOtp = await generateOtp();
    const phoneOtp = await generateOtp();

    await OtpModel.create({
        rollNumber,
        emailOtp,
        phoneOtp
    });

    // await sendEmailOtp(student.collegeEmail, emailOtp);
    // await sendPhoneOtp(student.phoneNumber, phoneOtp);


    return ;
}

export async function verifyLibrarianOrAdminCredentials(employeId: string) : Promise<void>  {
    const employe = await StaffRegistry.findOne({
        employeId,
    });
    if (!employe) {
        throw new AppError("Employe not found", 404);
    }

    const emailOtp = await generateOtp();
    const phoneOtp = await generateOtp();

    await OtpModel.create({
        employeId,
        emailOtp,
        phoneOtp
    });

    //TEMP_DISABLED: reason - these set of functions are not working correctly right now

    // await sendEmailOtp(employe.email, emailOtp);
    // await sendPhoneOtp(employe.phoneNumber, phoneOtp);


    return ;
}

export async function countStudents(session?: ClientSession): Promise<number>{
    return userModel.countDocuments({
        role : "student"
    }).session(session ?? null);   
}

export async function countLibrarians(session?: ClientSession): Promise<number>{
    return userModel.countDocuments({
        role : "librarian"
    }).session(session ?? null);   
}