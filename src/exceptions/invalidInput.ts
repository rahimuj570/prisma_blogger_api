import { CustomError, ErrorCodes } from "./customError";

export class InvalidInput extends CustomError{
    constructor(message:string, errors:any){
        super(message,ErrorCodes.INVALID_INPUT,422,errors)
    }
}