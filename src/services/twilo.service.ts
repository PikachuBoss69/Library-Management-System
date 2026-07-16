import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.Account_Sid;
const authToken = process.env.Auth_Token;
const twilioPhoneNumber = process.env.Twilio_Phone_Number;

if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error("Missing Twilio environment variables");
}

const client = twilio(accountSid, authToken);

export const sendSms = async (
    phoneNumber:number,
    otp:number
) => {
    return client.messages.create({
        body: `Your OTP is ${otp}. Please do not share it with anyone.`,
        from: twilioPhoneNumber,
        to: String(phoneNumber),
    });
};