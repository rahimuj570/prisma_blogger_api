import { CustomError, ErrorCodes } from "./customError";

export class InternalException extends CustomError{
    constructor(message:string, errors:any){
        super(message,ErrorCodes.INTERNAL_EXCEPTION,500,errors)
    }
}