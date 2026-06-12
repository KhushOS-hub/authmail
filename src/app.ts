import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express()

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

//Cors Configuration
app.use(cors({
    origin: ["https://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization"]
}))

import healthCheckrouter from "../routes/healthCheck.route.js"

app.get("/api/v1/healthcheck", healthCheckrouter)

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to AuthMail")
})

export default app