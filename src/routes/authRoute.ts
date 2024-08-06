import { Request, Router  } from "express";
import { login, logout, me, signup } from "../controllers/authController";
import { errorHandler } from '../errorHandler';
import { authMiddleware } from "../middlewares/authMiddleware";
const authRouter:Router = Router();

authRouter.post("/signup",errorHandler(signup))
authRouter.post("/login",errorHandler(login))
authRouter.get("/logout",errorHandler(logout))
authRouter.get("/me",[authMiddleware],errorHandler(me))

export default authRouter