import { Schema, model } from "mongoose";

const OTP_EXPIRY_TIME = 5 * 60 * 1000;

interface IOtp {
    rollNumber: string;
    emailOtp: number;
    phoneOtp: number;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    emailOtp: {
        type: Number,
        required: true,
    },
    phoneOtp: {
        type: Number,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
        
        // Expires in 5 minutes
        default: () => new Date(Date.now() + OTP_EXPIRY_TIME), 
    },
}, { timestamps: true });

const OtpModel = model<IOtp>("Otp", otpSchema);

export default OtpModel;