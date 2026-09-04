// auth.api.ts

import { api } from "./axios";

interface LoginResponse<T> {
    status: string;
    message: string;
    user : T;
    // whatever your actual backend returns
}

interface RegisterResponse{
    status: string;
    message: string;
}

interface LoginData {
    _id: string;
    rollNumber: string;
    role: "student" | "librarian" | "admin";
}


interface LogoutResponse{
    status: string;
    message: string;
}
interface OtpVerificationResponse{
    status: string;
    message: string;
}

export async function login(
    userId: string,
    password: string
): Promise<LoginResponse<LoginData>>{
    const response = await api.post("/auth/login", {
        userId,
        password,
    });

    return response.data;
}

export async function register(
    rollNumber: string
): Promise<RegisterResponse> {
    const response = await api.post("/auth/register", {
        rollNumber,
    });

    return response.data;
}

export async function logout(): Promise<LogoutResponse>{
    const response = await api.patch("/auth/logout");

    return response.data;
}

export async function verifyOtp(rollNumber: string,
    emailOtp : string,
    phoneOtp : string
): Promise<OtpVerificationResponse>{
    const response = await api.post("/auth/verify", {
        rollNumber, emailOtp, phoneOtp
    });

    return response.data;
}

