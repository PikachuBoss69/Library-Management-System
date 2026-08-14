import { z } from "zod";


export const registerUserSchema = z.object({
    body: z.object({
        rollNumber: z.coerce.string().trim().min(1),
    }),
});

export const verifyOtpSchema = z.object({
    body: z.object({
        rollNumber: z.coerce.string().trim().min(1),

        emailOtp: z.coerce
            .string()
            .trim()
            .length(6, "Email OTP must be 6 digits"),

        phoneOtp: z.coerce
            .string()
            .trim()
            .length(6, "Phone OTP must be 6 digits"),
    }),
});


export const loginUserSchema = z.object({
    body: z.object({
        userId: z.string().trim().min(1),

        password: z
            .string()
            .trim()
            .min(6, "Password must be at least 6 characters"),
    }),
});



export const changePasswordSchema = z.object({
    body: z
        .object({
            newPassword: z
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters"),

            retypePassword: z.string().trim(),
        })
        .refine(
            (data) => data.newPassword === data.retypePassword,
            {
                message: "Passwords do not match",
                path: ["retypePassword"],
            }
        ),
});


export const registerStaffSchema = z.object({
    body: z.object({
        employeeId: z.coerce.string().trim().min(1),
    }),
});

export const verifyStaffOtpSchema = z.object({
    body: z.object({
        employeeId: z.string().trim().min(1),

        role: z.enum(["librarian", "admin"]),

        emailOtp: z
            .string()
            .trim()
            .length(6, "Email OTP must be 6 digits"),

        phoneOtp: z
            .string()
            .trim()
            .length(6, "Phone OTP must be 6 digits"),
    }),
});


export const logoutUserSchema = z.object({
    body: z.object({}),
});