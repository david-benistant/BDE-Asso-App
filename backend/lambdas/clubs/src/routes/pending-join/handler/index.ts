import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import { TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import joinRequestRepository from "@repositories/join-request.repository";
import ApiError, { ApiErrorStatus } from "@services/errors.service";

export const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    context: CustomContext,
) => {
    const { id } = event.pathParameters;
    try {
        const response = await joinRequestRepository.get(id, context.tokenPayload.id)

        if (!response)
            return apiGatewayService.response(200, { pending: false });
        return apiGatewayService.response(200, { pending: true });
    } catch (e) {
        if (e instanceof ApiError) {
            e.code === ApiErrorStatus.NOT_FOUND;
            return apiGatewayService.response(200, { pending: false });
        }
        throw e;
    }
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
