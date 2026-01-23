
export enum ApiErrorStatus {
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    USERS_NOT_FOUND = "USERS_NOT_FOUND",
    BAD_CREDENTIALS = "BAD_CREDENTIALS",
    ALREADY_EXISTS = "ALREADY_EXISTS",
    FORBIDDEN = "FORBIDDEN",
    UNAUTHORIZED = "UNAUTHORIZED",
    REVOKED_TOKEN = "REVOKED_TOKEN",
    NOT_FOUND = "NOT_FOUND",
    BAD_REQUEST = "BAD_REQUEST",
}

class ApiError extends Error {
    type: string = "ApiError"
    httpStatus: number;
    code: ApiErrorStatus;
    message: string;

    constructor(httpStatus: number = 500, code: ApiErrorStatus = ApiErrorStatus.INTERNAL_SERVER_ERROR, message?: string ) {
        super()
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message || "";
    }
}

export default ApiError