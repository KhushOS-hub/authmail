import { Router } from "express";
import { registerUser } from "../controllers/register.controller.js";

const userRegisterRoute = Router()

userRegisterRoute.route("/register").post(registerUser)

export default userRegisterRoute