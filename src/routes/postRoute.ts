import { Router } from "express";
import { createPost, deletePost } from "../controllers/postControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { errorHandler } from '../errorHandler';

const postRouter:Router=Router();

postRouter.post("/create",[authMiddleware],errorHandler(createPost));
postRouter.delete("/delete/:post_id",[authMiddleware],errorHandler(deletePost));

export default postRouter;