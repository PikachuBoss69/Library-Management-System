// auth.api.ts

import { api } from "./axios";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data : T;
    // whatever your actual backend returns
}
interface RegisterData{
    rollNumber : string;
}
interface LoginData{
    data : string
}

interface LogoutResponse{
    success: boolean;
    message: string;
}
interface OtpVerificationResponse{
    success: boolean;
    message: string;
}

export async function login(
    userId: string,
    password: string
): Promise<ApiResponse<LoginData>>{
    const response = await api.post("/auth/login", {
        userId,
        password,
    });

    return response.data;
}

export async function register(
    rollNumber: string
): Promise<ApiResponse<RegisterData>>{
    const response = await api.post("/auth/register",{
        rollNumber
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