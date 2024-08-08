import { Router } from "express";
import { createPost, deletePost, showAllPost, updatePost } from "../controllers/postControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { errorHandler } from '../errorHandler';

const postRouter:Router=Router();

postRouter.post("/create",[authMiddleware],errorHandler(createPost));
postRouter.delete("/delete/:post_id",[authMiddleware],errorHandler(deletePost));
postRouter.put("/update/:post_id",[authMiddleware],errorHandler(updatePost));
postRouter.get("/show/",[authMiddleware],errorHandler(showAllPost));

export default postRouter;