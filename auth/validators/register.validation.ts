import { z } from "zod";

export const registerSchemaZod = z.object(
    {
        username: z.string()
            .min(3, "Username must be at least 3 characters long")
            .max(20, "Username cannot exceed 20 characters ")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
            .trim()
            .toLowerCase(),

        firstName: z.string()
            .min(1, "first name is required")
            .max(20, "first name is too long")
            .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, apostrophes and hyphens")
            .trim(),

        lastName: z.string()
            .min(1, "Last name is required")
            .max(20, "Last name too long")
            .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, apostrophes and hyphens")
            .trim(),

        email: z.email()
            .min(5, "Email too short")
            .max(255, "Email too long")
            .toLowerCase()
            .trim(),

        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password too long")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),

        avatar: z.string()
            .url("Avatar must be a valid URL")
            .optional()
            .nullable()
    }
)

export type RegisterInput = z.infer<typeof registerSchemaZod>