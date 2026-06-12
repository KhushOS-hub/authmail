import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/asynchandler.js";
import type { Request, Response } from "express";

const healthCheck = asyncHandler(async (req: Request, res: Response) => {
    res
        .status(200)
        .json(new ApiResponse(
            200,
            { status: "healthy", timestamp: new Date().toISOString() },
            "Server is running perfectly",
            true
        ))
})

export { healthCheck }