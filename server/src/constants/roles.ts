// This file defines the roles used in the application and their corresponding string values.
//Will be used for authorization and role-based access control throughout the application.

export const Roles = {
    ADMIN: "admin",
    LIBRARIAN: "librarian",
    STUDENT: "student",
} as const;

export type Role = typeof Roles[keyof typeof Roles];