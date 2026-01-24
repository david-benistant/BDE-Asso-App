import { MiddlewareObj, Request } from "@middy/core";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { JwtPayload } from "jsonwebtoken";
import { userValueObjectProps } from "../valueObjects/users.valueObject";
import { TSchema } from "@sinclair/typebox";
import ajvService from "../services/ajv.service";

export interface CustomContext extends Context {
    tokenPayload?: JwtPayload & userValueObjectProps;
}

const schemaValidatorMiddleware = (
    schema: TSchema,
): MiddlewareObj<APIGatewayProxyEventV2> => ({
    before: async (
        request: Request<APIGatewayProxyEventV2, any, Error, CustomContext>,
    ) => {
        const event = request.event;

        const body = event.body;

        ajvService.validate(schema, body);
    },
});

export default schemaValidatorMiddleware;
