import { User, type IUser, type LoginResponse } from "../models/user.model.js";
import { ApiResponse } from "../utils/api.response.js";
import { ApiError } from "../utils/api.error.js";
import { generateTokens } from "./token.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import crypto from "crypto";

interface loginCredentials extends Partial<IUser> {
    email: string;
    password: string;
    username?: string;
}

const loginUser = asyncHandler(async (req: Request, res: Response) => {

    const { email, password, username }: loginCredentials = req.body;

    if (!email && !username) {
        throw new ApiError(400, "email or username is required")
    }

    if (email && username) {
        throw new ApiError(400, "Please enter either email or username")
    }


    if (!password) throw new ApiError(400, "password is required")

    const query: { email?: string; username?: string } = {};

    if (email) {
        query.email = email.toLowerCase().trim();
    } else if (username) {
        query.username = username.trim();
    }

    const user = await User.findOne(query);

    if (!user) throw new ApiError(401, "User not found")

    const isPasswordTrue = await user.isPasswordCorrect(password)
    if (!isPasswordTrue) throw new ApiError(401, "Invalid credentials")

    const { accessToken, refreshToken } = await generateTokens(user._id)
    const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex")

    user.refreshToken = hashedRefreshToken
    user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const clientIP = req.ip || req.headers['x-forwarded-for']?.toString() || null;

    user.lastLoginAt = new Date()
    user.lastLoginIP = clientIP
    await user.save({ validateBeforeSave: false })

    const LoggedInUser: LoginResponse = {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified || false,
        lastLoginAt: new Date(),
        lastLoginIP: clientIP
    }


    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    status: "success",
                    user: LoggedInUser,
                },

                "User logged in",
                true
            )
        )
})

export { loginUser }