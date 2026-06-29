import { Router } from "express";
import { registerUser, sendEmailVerify, verifyEmail } from "../controllers/register.controller.js";
import { loginUser, logout } from "../controllers/login.controller.js";
import { validate } from "../middlewares/login.middleware.js";
import { loginSchemaZod } from "../validators/login.validaton.js";
import { forgotPasswordSchemaZod, resetPasswordSchemaZod } from "../validators/password.validation.js";
import { forgotPassword, resetPassword } from "../controllers/password.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(validate(loginSchemaZod), loginUser)
router.route("/logout").post(logout)
router.route("/forgot-password").post(validate(forgotPasswordSchemaZod), forgotPassword)
router.route("/reset-password/:token").post(validate(resetPasswordSchemaZod), resetPassword)
router.post("/send-verification-email", validate(forgotPasswordSchemaZod), sendEmailVerify);
router.get("/verify-email/:token", verifyEmail);

export default router