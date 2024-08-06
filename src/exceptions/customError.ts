export class CustomError extends Error{
    message: string;
    error_code: number;
    status_code: number;
    errors: any;
    constructor(message: string,
        error_code: number,
        status_code: number,
        errors: any){
            super(message);
            this.message=message;
            this.error_code=error_code;
            this.status_code=status_code;
            this.errors=errors;

    }
}
export enum ErrorCodes{
    USER_NOT_FOUND=1001,
    EMAIL_ALREADY_EXIST=1002,
    INCORRECT_PASSWORD=1003,
    INVALID_INPUT=1004,
    INTERNAL_EXCEPTION=2001
}