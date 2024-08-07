import { NextFunction, Request, Response } from "express"
import { prismaClient } from "..";
import { CreatePostSchema, UpdateSchema } from '../schemas/post';
import { Post, Prisma, PrismaClient, Tag } from "@prisma/client";
import { InternalException } from "../exceptions/internalException";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCodes } from "../exceptions/customError";
import { UnauthorizedException } from "../exceptions/unauthorizedException";


export const createPost= async(req:Request, res:Response, next:NextFunction)=>{
    CreatePostSchema.parse(req.body);
    let {post_title,post_content,tags,categories}  = req.body;


    try {
        await prismaClient.$transaction(async (tx) => {
          // Code running in a transaction...
          const post =await tx.post.create({
             data:{post_title:post_title,
                 post_content:post_content,
                 user_id:req.cookies.current_user.user_id}
             }
         )
        //Create Tags
        let finalTags:any=[] 
        for(var a of tags){
                    let foundTag = await tx.tag.findFirst({
                        where:{
                            tag_name:a
                        }
                    })
                    if(!foundTag){
                       foundTag = await tx.tag.create({
                            data:{
                                tag_name:a
                            }
                        })
                    }
                finalTags.push(foundTag.tag_id)}

        //Create Category
        let finalCategories:any=[] 
        for(var a of categories){
                    let foundCat = await tx.category.findFirst({
                        where:{
                            category_name:a
                        }
                    })
                    if(!foundCat){
                        foundCat = await tx.category.create({
                            data:{
                                category_name:a
                            }
                        })
                    }
                finalCategories.push(foundCat.category_id)}


                //Create Post_Category Relation
                for(var cat of finalCategories){
                    await tx.postOnCategory.create({
                        data:{
                            category_id:cat,
                            post_id:post.post_id
                        }
                    })
                }
                
                
                //Create Post_Tag Relation
                for(var t of finalTags){
                    await tx.postOnTag.create({
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
        let fetchedPost = await prismaClient.post.findFirst({
            where:{
                user_id:req.cookies.current_user.user_id,
                post_id:+post_id
            }
        })
        if(!fetchedPost){
            next(new UnauthorizedException());
        }
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

export const updatePost=async(req:Request, res:Response, next:NextFunction)=>{
    UpdateSchema.parse(req.body);
    const post_id = req.params.post_id;
    let {post_title,post_content,tags,categories}=req.body;
    if(!post_id){
        next(new BadRequestException("Post Id is missing!", ErrorCodes.INVALID_INPUT))
    }else{
        try{
            let fetchedPost = await prismaClient.post.findFirst({
                where:{
                    user_id:req.cookies.current_user.user_id,
                    post_id:+post_id
                }
            })
            if(!fetchedPost){
                next(new UnauthorizedException());
            }

        await prismaClient.$transaction(async(tx)=>{
            
            //Delete Previous Categories
            await tx.postOnCategory.deleteMany({
                where:{
                    post_id:+post_id,
                }
            })
            
            //Delete Previous Tags
            await tx.postOnTag.deleteMany({
                where:{
                    post_id:+post_id,
                }
            })

            //Retrieve Old Post Data
            let oldPostData = await tx.post.findFirst({
                where:{
                    post_id:+post_id
                }
            })

            //Update Operation
            let combineData = {...oldPostData}
            if(!(!post_content || post_content=="")){
                combineData={...combineData,post_content:post_content}
            }else if(!(!post_title || post_title=="")){
                combineData={...combineData,post_title:post_title}
            }
            
            let finalPostData = await tx.post.update({
                where:{
                    post_id:+post_id
                },
                data:combineData
            })


        //Create Tags
        let finalTags:any=[]
        if(tags){
        for(var a of tags){
                    let foundTag = await tx.tag.findFirst({
                        where:{
                            tag_name:a
                        }
                    })
                    if(!foundTag){
                       foundTag = await tx.tag.create({
                            data:{
                                tag_name:a
                            }
                        })
                    }
                finalTags.push(foundTag.tag_id)}
                }
        //Create Category
        let finalCategories:any=[] 
        if(categories){
        for(var a of categories){
                    let foundCat = await tx.category.findFirst({
                        where:{
                            category_name:a
                        }
                    })
                    if(!foundCat){
                        foundCat = await tx.category.create({
                            data:{
                                category_name:a
                            }
                        })
                    }
                finalCategories.push(foundCat.category_id)}
                }

                //Create Post_Category Relation
                for(var cat of finalCategories){
                    await tx.postOnCategory.create({
                        data:{
                            category_id:cat,
                            post_id:finalPostData.post_id
                        }
                    })
                }
                
                
                //Create Post_Tag Relation
                for(var t of finalTags){
                    await tx.postOnTag.create({
                        data:{
                            tag_id:t,
                            post_id:finalPostData.post_id
                        }
                    })
                }
                res.json(finalPostData)
        })
    }catch(err){
        next(new InternalException("Database Error! (-_-) Try Again!",err));
    }
    }
}