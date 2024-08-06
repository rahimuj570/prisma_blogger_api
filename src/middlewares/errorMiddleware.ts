import { NextFunction, Request, Response } from "express";
import { CustomError } from "../exceptions/customError";

export const errorMiddleware=(error:CustomError, req:Request, res:Response, next:NextFunction)=>{
    res.status(error.status_code).json({
        message:error.message,
        error_code:error.error_code,
        errors:error.errors
    })
}