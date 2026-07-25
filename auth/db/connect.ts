import mongoose from 'mongoose'
import { ApiError } from '../utils/api.error.js'

const authDB = mongoose.createConnection()

const connectAuthDB = async () => {

    try {
        const authUrl = process.env.AUTH_URL
        
        if (!authUrl) {
            throw new ApiError(500, "AuthDB Url key has some problems")
        } else {
            await authDB.openUri(authUrl)
            console.log("MongoDB connection established ✅");

        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("MongoDB connection error ❌", errorMessage);
        process.exit(1)
    }
}

export { connectAuthDB, authDB }