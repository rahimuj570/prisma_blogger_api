import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorizedException";
import * as jwt from "jsonwebtoken";
import { JwtException } from "../exceptions/jwtException";
import { ErrorCodes } from '../exceptions/customError';
import { JWT_SECRET } from "../secret";
import { prismaClient } from "..";


export const authMiddleware= async(req:Request, res:Response, next:NextFunction)=>{
    if(!req.cookies["current_user"]){
        next(new UnauthorizedException());
    }
    let token = req.headers.authorization;
    if(!token){
        next(new UnauthorizedException());
    }else{
        if(!(token.startsWith("bearer") || token.startsWith("Bearer"))){
            next(new JwtException("Invalid JWT",ErrorCodes.INVALID_JWT,null));
        }else{
            try{
                token = token.substring(7);
                const payload = jwt.verify(token,JWT_SECRET!) as any;
                let user = await prismaClient.user.findFirst({
                    where:{
                        user_id: payload.user_id
                    }
                })
                if(user && user.user_id===req.cookies.current_user.user_id){
                    delete (user as any)['user_password']
                    next()
                }else{
                    next(new JwtException("Invalid JWT",ErrorCodes.INVALID_JWT,null));
                }
            }catch(error:any){
                next(new JwtException("Expired JWT!",ErrorCodes.EXPIRED_JWT,error))
            }

        }
    }
}

export const adminMiddleWare=(req:Request, res:Response,next:NextFunction)=>{
    if(req.cookies.current_user){
        if(req.cookies.current_user.user_role=="ADMIN"){
            next()
        }
    }
    next(new UnauthorizedException())
}