import { Router } from "express";
import authRouter from "./authRoute";
import postRouter from "./postRoute";

const rootRouter = Router();

rootRouter.use('/auth',authRouter);
rootRouter.use('/post',postRouter);

export default rootRouter;