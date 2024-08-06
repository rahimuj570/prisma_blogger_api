import { Request, Router  } from "express";
import { login, signup } from "../controllers/authController";
import { errorHandler } from '../errorHandler';
const authRouter:Router = Router();

authRouter.post("/signup",errorHandler(signup))
authRouter.post("/login",login)

export default authRouter