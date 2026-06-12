import mongoose from 'mongoose'
import { ApiError } from '../utils/api.error.js'

const connectDB = async () => {

    try {
        const mongoUrl: string | undefined = process.env.MONGO_URL
        if (!mongoUrl) {
            throw new ApiError(500, "MongoDB Url key has some problems")
        } else {
            await mongoose.connect(mongoUrl)
            console.log("MongoDB connection established ✅");

        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("MongoDB connection error ❌", errorMessage);
        process.exit(1)
    }
}

export { connectDB }