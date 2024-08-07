import { Request, Response, NextFunction } from 'express';
import { prismaClient } from "..";
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { LoginSchema, SignUpSchema } from "../schemas/user";
import { BadRequestException } from '../exceptions/badRequest';
import { ErrorCodes } from '../exceptions/customError';

let checkInput=async(req:Request)=>{
    SignUpSchema.parse(req.body);
}

export const signup = async(req:Request,res:Response, next:NextFunction)=>{
    await checkInput(req);
    let {user_name, user_email,user_password} = req.body;
    let user = await prismaClient.user.findFirst({
        where:{
            user_email:user_email
        }
    })
    if(user){
        next(new BadRequestException("User Already Exist!",ErrorCodes.EMAIL_ALREADY_EXIST))
    }else{
        user = await prismaClient.user.create({
            data:{
                user_name,
                user_email,
                "user_password": hashSync(user_password,10)
            }
        })
        res.json(user);
    }
}

interface responseLogin{
    user_id:Number
    user_name:String
    user_email:String
    user_password:String
}

export const login = async(req:Request,res:Response, next:NextFunction)=>{
    LoginSchema.parse(req.body)
    let {user_email,user_password} = req.body;
    let user = await prismaClient.user.findFirst({
        where:{
            user_email:user_email
        }
    })
    if(!user){
        next(new BadRequestException("User Not Found!",ErrorCodes.USER_NOT_FOUND))
    }else{
        if(compareSync(user_password,user.user_password)){
            const token = jwt.sign({"user_id":user.user_id},JWT_SECRET!)
            delete (user as Partial<responseLogin>).user_password;
            res.cookie("current_user",user,{
                expires:new Date(Date.now()+24*60*60*1000),
                httpOnly:true
            })
            res.json({...user,"jwt_token":token});
        }else{
            next(new BadRequestException("Incorrect Password!",ErrorCodes.INCORRECT_PASSWORD))
        }
    }
}

export const logout=(req:Request,res:Response,next:NextFunction)=>{
    res.clearCookie("current_user");
    res.json({
        "logout_status":true
    })
}

export const me=(req:Request, res:Response, next:NextFunction)=>{
    res.json({...req.cookies.current_user})
}