import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api.error.js";
import { Types } from "mongoose";

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

const generateTokens = async (userId: Types.ObjectId | string): Promise<TokenResponse> => {
    try {
        // Find user by ID
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Validate tokens were generated
        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Failed to generate tokens");
        }

        console.log("Token generation successful for user:", userId);

        return { accessToken, refreshToken };

    } catch (error) {
        // Log the error with context
        console.error(`Token generation error for user ${userId}:`, error);

        // Re-throw if it's already an ApiError
        if (error instanceof ApiError) {
            throw error;
        }

        // Handle mongoose or other errors
        if (error instanceof Error) {
            throw new ApiError(500, `Failed to generate tokens: ${error.message}`);
        }

        // Fallback error
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

export { generateTokens };