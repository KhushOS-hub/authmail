import { Router } from "express";
import { registerUser } from "../controllers/register.controller.js";
import { loginUser } from "../controllers/login.controller.js";
import { validate } from "../middlewares/login.middleware.js";
import { loginSchemaZod } from "../validators/login.validaton.js";
import { forgotPasswordSchemaZod } from "../validators/password.validation.js";
import { forgotPassword } from "../controllers/password.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(validate(loginSchemaZod), loginUser)
router.route("/forgot-password").post(validate(forgotPasswordSchemaZod), forgotPassword)

export default router