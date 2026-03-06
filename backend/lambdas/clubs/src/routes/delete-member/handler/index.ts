import { Handler } from "aws-lambda";
import middy from "@middy/core";
import ClubValueObject, { Roles } from "@valueObjects/club.valueObject";
import clubRepository from "@repositories/club.repository";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import schemaValidatorMiddleware from "@middlewares/schema-validator";
import notificationsRepository from "@repositories/notifications.repository";
import NotificationValueObject from "@valueObjects/notifications.valueObject";
import UserValueObject from "@valueObjects/users.valueObject";
import usersRepository from "@repositories/users.repository";
import NotificationService from "@services/notifications.service";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    context: CustomContext,
) => {
    const { id, userId } = event.pathParameters;

    const club = await clubRepository.get(id);

    if (club.getPresidentId() !== context.tokenPayload?.id) {
        throw new ApiError(
            403,
            ApiErrorStatus.FORBIDDEN,
            "You are not allowed to perform this action",
        );
    }

    if (club.getPresidentId() === userId) {
        throw new ApiError(
            400,
            ApiErrorStatus.BAD_REQUEST,
            "You cannot remove this user from this club",
        );
    }

    const newClub = new ClubValueObject({
        ...club.getObject(),
        members: club.getMembers().filter((member) => member.id !== userId),
    });

    await clubRepository.put(newClub);

    const user = await usersRepository.get(userId);

    const newUser = new UserValueObject({
        ...user.getObject(),
        joinedClubs: user
            .getJoinedClubs()
            .filter((clubId) => clubId !== newClub.getId()),
    });

    await usersRepository.put(newUser);

    await NotificationService.send(
        NotificationValueObject.create(
            "kicked-from-club",
            {
                ":clubName": club.getDisplayName(),
                ":clubPresident": club
                    .getMembers()
                    .find((member) => member.id === club.getPresidentId())
                    .displayName,
            },
            user,
            club.getId(),
        ),
    );

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
