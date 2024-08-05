import { Request, Router  } from "express";
import { signup } from "../controllers/authController";
const authRouter:Router = Router();

authRouter.get("/signup",signup)

export default authRouter