import { MiddlewareObj, Request } from "@middy/core";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { JwtPayload } from "jsonwebtoken";
import { userValueObjectProps } from "@valueObjects/users.valueObject";
import { TSchema } from "@sinclair/typebox";
import ajvService from "@services/ajv.service";
import ApiError, { ApiErrorStatus } from "@services/errors.service";

export interface CustomContext extends Context {
    tokenPayload?: JwtPayload & userValueObjectProps;
}

const schemaValidatorMiddleware = (
    schema: TSchema,
): MiddlewareObj<APIGatewayProxyEventV2> => ({
    before: async (request) => {
        const { event } = request;

        if (!event.body) {
            throw new ApiError(400, ApiErrorStatus.BAD_REQUEST, "Missing body");
        }

        const body = typeof event.body === "string"
            ? JSON.parse(event.body)
            : event.body;

        ajvService.validate(schema, body);

        request.event.body = body;
    },
});

export default schemaValidatorMiddleware;
