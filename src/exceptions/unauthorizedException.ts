import { CustomError, ErrorCodes } from "./customError";

export class UnauthorizedException extends CustomError{
    constructor(){
        super("Unauthorized Exception!",ErrorCodes.UNAUTHORIZED_ACCESS,401,null);
    }
}