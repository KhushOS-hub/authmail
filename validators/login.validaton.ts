import { z } from "zod"

export const loginSchemaZod = z.object(
    {
        username: z.string().optional(),

        email: z.email()
            .min(5, "Email too short")
            .max(255, "Email too long")
            .toLowerCase()
            .trim(),

        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password too long"),

    }
)

export type LoginInput = z.infer<typeof loginSchemaZod>