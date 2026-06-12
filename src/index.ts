import { configDotenv } from "dotenv"
configDotenv({ path: "./.env" })

import app from "./app.js"
import { connectDB } from "../db/connect.js"

const port = parseInt(process.env.PORT ?? "8000", 10);

(async () => {
  try {
    console.log("Connecting to MongoDB...")

    await connectDB()

    console.log("MongoDB connected")

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  } catch (error: unknown) {
    const err =
      error instanceof Error ? error.message : String(error)

    console.error("MongoDB connection error:", err)
    process.exit(1)
  }
})()