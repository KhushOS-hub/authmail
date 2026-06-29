import { ApiResponse } from "../utils/api.response.js";
import { ApiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { User, type UserResponse } from "../models/user.model.js";
import { forgotPasswordMailgen, sendEmail } from "../utils/mail.js";
import crypto from "crypto"
import bcrypt from "bcrypt"


const forgotPassword = asyncHandler(async (req: Request, res: Response) => {

    const { email } = req.body
    if (!email) throw new ApiError(400, "Email is required")

    const user = await User.findOne({ email })
    if (!user) throw new ApiError(404, "User not found")

    if (user.isEmailVerified == false) throw new ApiError(404, "Must verify email before requesting for new password")

    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;

    const { unhashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()
    user.passwordResetToken = hashedToken
    user.passwordResetTokenExpiry = tokenExpiry

    await user.save({ validateBeforeSave: false })

    try {

        const resetLink = `${req.protocol}://${req.get("host")}/reset-password?token=${unhashedToken}`;

        await sendEmail({
            email: user.email,
            subject: "Reset Your Password - YourAppName",
            mailgenContent: forgotPasswordMailgen(
                user.username,
                resetLink
            )
        });
    } catch (emailError) {
        // Clear token if email fails
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        throw new ApiError(500, "Failed to send reset email. Please try again.");
    }

    const userResponse: UserResponse = {
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, { status: "success", data: userResponse },
                " A password reset link has been sent", true
            )
        )
})

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const newPassword = req.body.newPassword
    const token = req.params.token as string

    if (!token) throw new ApiError(404, "Invalid Request")
    if (!newPassword) throw new ApiError(404, "Please enter the new password")

    const hashedToken = crypto.createHash("sha-256").update(token).digest("hex")
    const users = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpiry: { $gt: Date.now() }
    })

    if (!users) throw new ApiError(200, "Invalid or expired token")

    users.password = await bcrypt.hash(newPassword, 10)
    users.passwordResetToken = undefined
    users.passwordResetTokenExpiry = undefined
    users.passwordChangedAt = new Date()

    await users.save({ validateBeforeSave: false })

    res.status(200).json(new ApiResponse(200, { status: "Success", data: null }, "Password has been reset", true))
})

export { forgotPassword, resetPassword }