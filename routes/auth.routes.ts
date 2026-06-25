import { Router } from "express";
import { registerUser } from "../controllers/register.controller.js";
import { loginUser } from "../controllers/login.controller.js";
import { validate } from "../middlewares/login.middleware.js";
import { loginSchemaZod } from "../validators/login.validaton.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(validate(loginSchemaZod), loginUser)

export default router