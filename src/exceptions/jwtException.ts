import { CustomError } from "./customError";

export class JwtException extends CustomError{
    constructor(message:string,error_code:number,errors:any){
        super(message,error_code,401,errors);
    };
    
}