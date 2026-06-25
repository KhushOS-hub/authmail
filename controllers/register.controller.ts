import { User } from "../models/user.model.js"
import type { UserResponse } from "../models/user.model.js"
import { ApiResponse } from "../utils/api.response.js"
import { ApiError } from "../utils/api.error.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import type { Request, Response } from "express"
import { sendEmail, emailVerificationMailgen } from "../utils/mail.js"
import { registerSchemaZod } from "../validators/register.validation.js"


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

export { registerUser }