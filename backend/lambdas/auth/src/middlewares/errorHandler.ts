import { MiddlewareObj } from "@middy/core";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import apiGatewayService from "@services/api-gateway.service";

const errorHandlerMiddleware = (): MiddlewareObj => ({
    onError: async (request) => {
        const error: ApiError | Error = request.error as ApiError | Error;

        let httpStatus = 500;
        let message = "Internal Server Error";
        let code = ApiErrorStatus.INTERNAL_SERVER_ERROR;

        if (error instanceof ApiError) {
            httpStatus = error.httpStatus;
            message = error.message;
            error.code = error.code;
        }

        const response = apiGatewayService.response(httpStatus, {
            httpStatus,
            error: message,
            code,
        });

        console.error(error)

        request.response = response;
    },
});

export default errorHandlerMiddleware;
