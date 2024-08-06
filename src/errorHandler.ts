import { NextFunction, Request, Response } from "express"
import { CustomError, ErrorCodes } from "./exceptions/customError";
import { InternalException } from "./exceptions/internalException";
import { ZodAny, ZodError } from "zod";
import { BadRequestException } from "./exceptions/badRequest";
import { InvalidInput } from "./exceptions/invalidInput";

export const errorHandler=(method:Function)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
            await method(req, res, next);
        }catch(error:any){
            let exception:CustomError;
            if(error instanceof CustomError){
                exception=error;
            }else{
                if(error instanceof ZodError){
                    exception = new InvalidInput("Validation Error!",error.errors)
                }else{
                    exception = new InternalException("Server Error!",error)
                }
            }
            next(exception)
        }
    }
}