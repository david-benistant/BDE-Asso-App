import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import notificationsRepository from "@repositories/notifications.repository";

export const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, {}>,
    context: CustomContext
) => {
    const userId = context.tokenPayload.id

    const notifications = await notificationsRepository.query(userId);

    return apiGatewayService.response(
        200,
        notifications.map((item) => item.getObject()),
    );
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
