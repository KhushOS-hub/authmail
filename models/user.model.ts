import { Schema, model, Document } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

export interface IUser extends Document {
    avatar?: string | null
    username: string
    firstName: string
    lastName: string
    password: string
    email: string
    isEmailVerified: boolean

    refreshToken?: string | null
    refreshTokenExpiry?: Date | null

    emailVerificationToken?: string | undefined
    emailVerificationTokenExpiry?: Date | undefined

    passwordResetToken?: string | undefined
    passwordResetTokenExpiry?: Date | undefined

    lastLoginAt?: Date | null
    lastLoginIP?: string | null
    passwordChangedAt?: Date | null
    passwordHistory?: string[] | null

    isloggedIn: boolean

    isPasswordCorrect(password: string): Promise<boolean>

    generateAccessToken(): string

    generateRefreshToken(): string

    generateTemporaryToken(): {
        unhashedToken: string
        hashedToken: string
        tokenExpiry: Date
    }
}


const userSchema = new Schema<IUser>({
    avatar: { type: String, default: null },

    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        trim: false,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },

    isloggedIn: {type: Boolean, default: false},

    refreshToken: { type: String, select: false, default: null },
    refreshTokenExpiry: { type: Date, default: null },

    emailVerificationToken: { type: String, select: false, default: null },
    emailVerificationTokenExpiry: { type: Date, default: null },

    passwordResetToken: { type: String, select: false, default: null },
    passwordResetTokenExpiry: { type: Date, default: null },

    lastLoginAt: { type: Date, default: null },
    lastLoginIP: { type: String, select: false, default: null },
    passwordChangedAt: { type: Date, default: null }


}, { timestamps: true });

// Password Hashing and comparison
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10);

});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

// all about the tokens

userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: "15m"
        }
    )
}

userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d" }
    )
}

userSchema.methods.generateTemporaryToken = function () {
    const unhashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto
        .createHash("sha256")
        .update(unhashedToken)
        .digest("hex")

    const tokenExpiry = Date.now() + 20 * 60 * 1000

    return { unhashedToken, hashedToken, tokenExpiry }
}


export const User = model<IUser>("User", userSchema)

export interface UserResponse {
    id: string
    avatar?: string | null
    username: string
    firstName: string
    lastName: string
    email: string
}

export interface LoginResponse {
    id: string
    email: string
    username: string
    isEmailVerified: boolean
    lastLoginAt?: Date
    lastLoginIP?: string | null
}