import {userModel} from "../models/users.model";
import {StudentRegistry} from "../models/studentRegistry.model";
import OtpModel from "../models/otp.model";
import jwt from "jsonwebtoken";
import {Request, Response } from "express";
import {generateToken, compareOtps, sendPhoneOtp, sendEmailOtp, generateOtp, createUser, generatePassword, sendPasswordEmail, changepassword} from "../services/auth.service";
import {AppError} from "../utils/AppError";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

interface VerificationResult {
    isVerified: boolean;
}

export async function registerUser(req: Request, res: Response) : Promise<void> {
    try{

    const {rollNumber, role} = req.body;
        
    //Checks whether the provided roll number already exists in the database or not
    const isExistingUser = await userModel.findOne({rollNumber});

    if( isExistingUser ) {
         throw new AppError("User already exists", 422);
    }

    //Send Email and Phone OTP to the user for verification
    await verifyCredentials(rollNumber);


    return ;
    }catch(error){
        if (error instanceof AppError) {
        throw error;
        }

        throw new AppError(
            "Internal Server Error",
            500
        );
    }


}

export async function loginUser(req: Request, res: Response): Promise<void> {
    try{

        const {rollNumber , password } = req.body;


        
        const user =await userModel.findOne({
            rollNumber :rollNumber
        }).select("+password");

        if(!user){
            throw new AppError("User not found", 404);
        }
      

        const isValidPassword : boolean = await user.comparePassword(password);

        if (!isValidPassword) {
            throw new AppError("Invalid password", 401);
        }

        const token = await generateToken(user);

        console.log("Generated token for user:"); // Log the generated token

        res.cookie("token", token)

        res.status(200).json({
            message:"User LogIn Successfully",
            user: {
                _id: user._id,
                rollNumber: user.rollNumber,
                role: user.role
            },
            token
        });
        return ;
    }catch(error){
        if (error instanceof AppError) {
        throw error;
        }

        throw new AppError(
            "Internal Server Error",
            500
        );
    }

}
    
async function logoutUser(req: Request, res: Response ) {}

async function verifyCredentials(rollNumber: string) : Promise<void>  {
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

    await sendEmailOtp(student.collegeEmail, emailOtp);
    await sendPhoneOtp(student.phoneNumber, phoneOtp);

    return ;
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
    try{
        const {rollNumber, role, emailOtp, phoneOtp} = req.body;
        
        // Fetch the generated OTPs from the database for the given roll number
        const otpRecord = await OtpModel.findOne({rollNumber});
    
    if (!otpRecord) {
        throw new AppError("OTP expired or not found", 404);
    }
    
    const generatedEmailOtp = otpRecord.emailOtp;
    const generatedPhoneOtp = otpRecord.phoneOtp;

    if (!generatedEmailOtp || !generatedPhoneOtp) {
        throw new AppError("OTP not found for the provided roll number", 404);
    }

    // Verify the provided OTPs against the generated ones
    const isEmailVerified = compareOtps(emailOtp, generatedEmailOtp);
    const isPhoneVerified = compareOtps(phoneOtp, generatedPhoneOtp);

    if(!isEmailVerified || !isPhoneVerified) {
        throw new AppError("Invalid OTP provided", 400);
    }

    //Otp is deleted after verification to prevent reuse and ensure security
    await OtpModel.deleteOne({ rollNumber });

    res.status(200).json({
        status: "Success",
        message: "OTP verified successfully",
        isVerified: true,   
    });

    //Create a random password for the user, which will be changed later on first login by the user
    let password = await generatePassword();

    
    //Create a new User in the database with the provided roll number, password, and role
    const user = await createUser(rollNumber, password, role);
    
    const userEmail= await StudentRegistry.findOne({rollNumber});
    
    if(!userEmail) {
        throw new AppError("Student Email not found", 404);
    }

    //Temprory password sending via mail
    await sendPasswordEmail(userEmail.collegeEmail, password);


    const token = await generateToken(user);


    res.cookie("token", token, {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: "strict",
    });

    
    res.status(201).json({
        message:"User Created Successfully",
        user: {
            studentRegistryId: user._id,
            rollNumber: user.rollNumber,
            role: user.role,
            isEmailVerified: true,
            isPhoneVerified: true,
            isFirstLogin: true,
        },
        status: "Success",
        token
    });

    return;

    }catch(error){
        if (error instanceof AppError) {
        throw error;
        }

        throw new AppError(
            "Internal Server Error",
            500
        );
    }          
}

export async function changePassword(req: Request, res: Response): Promise<void> {
    try{
        const { newPassword, retypePassword } = req.body;

        if(!newPassword || !retypePassword) {
            throw new AppError("Password Not found", 404);
        }

        if(newPassword !== retypePassword) {    
            throw new AppError("Passwords do not match", 400);
        }

        const user = req.user;
        if(!user){
            throw new AppError("user not found",404)
        }

        await changepassword(user, newPassword);

        res.status(200).json({
            message : "New password created successfully",
            status : "Success",
        });

        return ;

    }catch(error){
            if (error instanceof AppError) {
        throw error;
        }

        throw new AppError(
            "Internal Server Error",
            500
        );

    }

}
