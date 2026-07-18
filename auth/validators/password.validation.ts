import { z } from "zod";

export const forgotPasswordSchemaZod = z.object({
    email: z.email()
        .min(5, "Email is too short")
        .max(255, "Email is too long")
        .toLowerCase()
        .trim()
})

export const resetPasswordSchemaZod = z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password too long")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character")
})

export type forgotPasswordZod = z.infer<typeof forgotPasswordSchemaZod>
export type resetPasswordZod = z.infer<typeof resetPasswordSchemaZod>