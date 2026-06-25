import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error.js";
import { z } from "zod";

const validate = <T>(schema: z.ZodType<T>) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
        const err = result.error.issues.map(issue => issue.message)
        return res.status(400).json(new ApiError(400, "zod validation error", err))
    }

    req.body = result.data
    next()
}

export { validate }