import { CustomError } from "./customError";

export class BadRequestException extends CustomError{
    constructor(message:string, error_code:number){
        super(message,error_code,400,null)
    }
}