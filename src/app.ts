import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express()

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

//Cors Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? [],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization"]
}))

import healthCheckrouter from "../routes/healthCheck.route.js"
import userRegisterRoute from "../routes/auth.routes.js";
import userLoginRoute from "../routes/auth.routes.js"
import forgotPasswordRoute from "../routes/auth.routes.js"
import resetPasswordRoute from "../routes/auth.routes.js"
import sendEmailVerification from "../routes/auth.routes.js"
import emailVerifiyRoute from "../routes/auth.routes.js"
import logoutRoute from "../routes/auth.routes.js"
app.use("/api/v1/healthcheck", healthCheckrouter)
app.use("/api/v1/auth", userRegisterRoute)
app.use("/api/v1/auth", userLoginRoute)
app.use("/api/v1/auth", forgotPasswordRoute)
app.use("/api/v1/auth", resetPasswordRoute)
app.use("/api/v1/auth", sendEmailVerification)
app.use("/api/v1/auth", emailVerifiyRoute)
app.use("/api/v1/auth", logoutRoute)


app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to AuthMail")
})

export default app