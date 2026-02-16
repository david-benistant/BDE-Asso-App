import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import { bodySchema, TBody, TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import clubRepository from "@repositories/club.repository";
import ClubValueObject, { Roles } from "@valueObjects/club.valueObject";
import usersRepository from "@repositories/users.repository";
import joinRequestRepository from "@repositories/join-request.repository";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import schemaValidatorMiddleware from "@middlewares/schema-validator";
import notificationsRepository from "@repositories/notifications.repository";
import NotificationValueObject from "@valueObjects/notifications.valueObject";

export const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<TBody, TPathParams>,
    context: CustomContext,
) => {
    const { id } = event.pathParameters;

    const club = await clubRepository.get(id);

    if (club.getPresidentId() !== context.tokenPayload?.id) {
        throw new ApiError(
            403,
            ApiErrorStatus.FORBIDDEN,
            "You are not allowed to perform this action",
        );
    }
    await joinRequestRepository.delete(id, event.body.userId);

    await notificationsRepository.put(
        NotificationValueObject.create("refused-from-club", {
            ":clubName": club.getDisplayName(),
            ":clubPresident": club
                .getMembers()
                .find((member) => member.id === club.getPresidentId()).displayName,
        }, event.body.userId, club.getId()),
    );

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
