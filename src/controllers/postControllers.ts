import { NextFunction, Request, Response } from "express"
import { prismaClient } from "..";
import { PostSchema } from '../schemas/post';
import { Post, Prisma, PrismaClient, Tag } from "@prisma/client";
import { InternalException } from "../exceptions/internalException";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCodes } from "../exceptions/customError";

export const createPost= async(req:Request, res:Response, next:NextFunction)=>{
    //PostSchema.parse(req.body);
    let {post_title,post_content,tags,categories}  = req.body;


    try {
        await prismaClient.$transaction(async () => {
          // Code running in a transaction...
          const post =await prismaClient.post.create({
             data:{post_title:post_title,
                 post_content:post_content,
                 user_id:req.cookies.current_user.user_id}
             }
         )
        //Create Tags
        let finalTags:any=[] 
        for(var a of tags){
                    let foundTag = await prismaClient.tag.findFirst({
                        where:{
                            tag_name:a
                        }
                    })
                    if(!foundTag){
                       foundTag = await prismaClient.tag.create({
                            data:{
                                tag_name:a
                            }
                        })
                    }
                finalTags.push(foundTag.tag_id)}

        //Create Category
        let finalCategories:any=[] 
        for(var a of categories){
                    let foundCat = await prismaClient.category.findFirst({
                        where:{
                            category_name:a
                        }
                    })
                    if(!foundCat){
                        foundCat = await prismaClient.category.create({
                            data:{
                                category_name:a
                            }
                        })
                    }
                finalCategories.push(foundCat.category_id)}


                //Create Post_Category Relation
                for(var cat of finalCategories){
                    await prismaClient.postOnCategory.create({
                        data:{
                            category_id:cat,
                            post_id:post.post_id
                        }
                    })
                }
                
                
                //Create Post_Tag Relation
                for(var t of finalTags){
                    await prismaClient.postOnTag.create({
                        data:{
                            tag_id:t,
                            post_id:post.post_id
                        }
                    })
                }

            res.json(post)
            })
        } catch (err) {
        next(new InternalException("Database Error! (-_-) Try Again!",err))
      }
}

export const deletePost=async(req:Request,res:Response,next:NextFunction)=>{
    const post_id = req.params.post_id;
    if(!post_id){
        next(new BadRequestException("Post Id is missing!", ErrorCodes.INVALID_INPUT))
    }else{
        await prismaClient.post.delete({
            where:{
                post_id:+post_id
            }
        })
        res.json({
            post_id:post_id,
            delete_status:'success'
        })
    }
}