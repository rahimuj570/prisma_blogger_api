import { Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { Optional } from "@prisma/client/runtime/library";

export const signup = async(req:Request,res:Response)=>{
    let {user_name, user_email,user_password} = req.body;
    let user = await prismaClient.user.findFirst({
        where:{
            user_email:user_email
        }
    })
    if(user){
        throw Error("User already exist");
    }
    user = await prismaClient.user.create({
        data:{
            user_name,
            user_email,
            "user_password": hashSync(user_password,10)
        }
    })
    res.json(user);
}

interface responseLogin{
    user_id:Number
    user_name:String
    user_email:String
    user_password:String
}

export const login = async(req:Request,res:Response)=>{
    let {user_email,user_password} = req.body;
    let user = await prismaClient.user.findFirst({
        where:{
            user_email:user_email
        }
    })
    if(!user){
        throw Error("User not exist");
    }
    if(compareSync(user_password,user.user_password)){
        const token = jwt.sign({"user_id":user.user_id},JWT_SECRET!)
        delete (user as Partial<responseLogin>).user_password;
        res.json({...user,"jwt_token":token});
    }else{
        throw Error("Incorrect password")
    }
}