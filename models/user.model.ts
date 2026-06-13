import { Schema, model, Document } from "mongoose";

export interface IUser extends Document{
    avatar?: string
    username: string
    firstName: string
    lastName: string
    password: string
    email: string
    isEmailVerified: boolean

    refreshToken?: string
    refreshTokenExpiry?: Date

    emailVerificationToken?: string
    emailVerificationTokenExpiry?: Date
    
    passwordResetToken?: string
    passwordResetTokenExpiry?: Date

    lastLoginAt?: Date
    lastLoginIP?: string
    passwordChangedAt?: Date
    passwordHistory?: string[]
}


const userSchema = new Schema<IUser>({
    avatar: {type: String, default: null},

    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    firstName:{
        type: String,
        required: true,
        trim: true,
    },

    lastName:{
        type: String,
        required: true,
        trim: true,
    },

    password:{
        type: String,
        required: true,
        select: false,
        trim: false,
    },

    email:{
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
    },
 
    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },

    refreshToken: String,
    refreshTokenExpiry: Date,

    emailVerificationToken:{ type: String, select: false},
    emailVerificationTokenExpiry: Date,

    passwordResetToken:{ type: String, select: false},
    passwordResetTokenExpiry: Date,

    lastLoginAt: Date,
    lastLoginIP: String,
    passwordChangedAt: Date,

    passwordHistory: {
        type: [String],
        select: false,
        default: []
    },

}, {timestamps: true});

export const User = model<IUser>("User", userSchema)

export interface UserResponse{
    id: string
    avatar?: string
    username: string
    firstName: string
    lastName: string
    email: string
}