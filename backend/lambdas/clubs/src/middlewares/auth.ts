import { MiddlewareObj, Request } from "@middy/core";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import tokensService from "@services/tokens.service";
import { JwtPayload } from "jsonwebtoken";
import { userValueObjectProps } from "@valueObjects/users.valueObject";

export interface CustomContext extends Context {
    tokenPayload?: JwtPayload & userValueObjectProps;
}

const authMiddleware = (): MiddlewareObj<APIGatewayProxyEventV2> => ({
    before: async (
        request: Request<APIGatewayProxyEventV2, any, Error, CustomContext>,
    ) => {
        const event = request.event;

        const token =
            event.headers?.authorization || event.headers?.Authorization;

        if (!token) {
            throw new ApiError(
                401,
                ApiErrorStatus.UNAUTHORIZED,
                "No access token",
            );
        }

        const payload = tokensService.verifyAccessToken(
            token.replace("Bearer ", "").replace("Token ", ""),
        );

        request.context.tokenPayload = payload;
    },
});

export default authMiddleware;
