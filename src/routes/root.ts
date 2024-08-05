import { Router } from "express";
import authRouter from "./authRoute";

const rootRouter = Router();

rootRouter.use('/auth',authRouter);

export default rootRouter;