import { User } from "../models/user.model.js"
import type { UserResponse } from "../models/user.model.js"
import { ApiResponse } from "../utils/api.response.js"
import { ApiError } from "../utils/api.error.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import type { Request, Response } from "express"
import { sendEmail, emailVerificationMailgen } from "../utils/mail.js"
import { registerSchemaZod } from "../validators/register.validation.js"
import crypto from "crypto"


const registerUser = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = registerSchemaZod.parse(req.body);
    const {
        email,
        username,
        password,
        firstName,
        lastName,
        avatar
    } = validatedData;

    const existedUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existedUser) throw new ApiError(409, "User already exist");

    // else create a new user
    const user = await User.create({
        email,
        username,
        password,
        firstName,
        lastName,
        isEmailVerified: false,
        ...(avatar !== undefined && { avatar })

    });


    const { hashedToken, unhashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken,
        user.emailVerificationTokenExpiry = tokenExpiry

    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgen(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        )
    })

    const userResponse: UserResponse = {
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200, { status: "success", data: userResponse }, "User creation success", true
            )
        )
})

const sendEmailVerify = asyncHandler(async (req: Request, res: Response) => {

    const email = req.body.email as string
    if (!email) throw new ApiError(404, "Email is required")

    const user = await User.findOne({ email })
    if (!user) throw new ApiError(404, "User not found")

    user.emailVerificationToken = undefined
    user.emailVerificationTokenExpiry = undefined

    const { unhashedToken, hashedToken } = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken
    user.emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgen(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        )
    })

    res
        .status(200)
        .json(new ApiResponse(200,
            { status: "success", data: null },
            "Verification email has been sent", true))
})

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const token = req.params.token as string;

    if (!token) {
        throw new ApiError(400, "Token is required");
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiry: { $gt: new Date() } // Token not expired
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    if (user.isEmailVerified) {
        throw new ApiError(400, "Email already verified");
    }

    // Verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(
            200,
            { status: "success" },
            "Email has been verified successfully",
            true
        )
    );
});

export { registerUser, sendEmailVerify, verifyEmail }