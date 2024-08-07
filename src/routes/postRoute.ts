import { Router } from "express";
import { createPost } from "../controllers/postControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { errorHandler } from '../errorHandler';

const postRouter:Router=Router();

postRouter.post("/create",[authMiddleware],errorHandler(createPost));

export default postRouter;