import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import { TBody, TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import clubRepository from "@repositories/club.repository";
import joinRequestRepository from "@repositories/join-request.repository";
import JoinRequestValueObject from "@valueObjects/join-request.valueObject";
import NotificationValueObject from "@valueObjects/notifications.valueObject";
import usersRepository from "@repositories/users.repository";
import notifictionsService from "@services/notifications.service";

export const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<TBody, TPathParams>,
    context: CustomContext,
) => {
    const { id } = event.pathParameters;
    const club = await clubRepository.get(id);

    await joinRequestRepository.put(new JoinRequestValueObject({
        clubId: id,
        userId: context.tokenPayload.id,
        message: event.body.message || "",
        displayName: context.tokenPayload.displayName
    }))

    const president = await usersRepository.get(club.getPresidentId())

    await notifictionsService.send(
        NotificationValueObject.create("join-request", {
            ":userName": context.tokenPayload.displayName,
            ":clubName": club.getDisplayName(),
        }, president, `${club.getId()}/members`),
    );

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
