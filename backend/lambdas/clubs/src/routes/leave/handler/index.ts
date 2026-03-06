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
import usersRepository from "@repositories/users.repository";
import UserValueObject from "@valueObjects/users.valueObject";
import notifictionsService from "@services/notifications.service";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    context: CustomContext,
) => {
    const { id } = event.pathParameters;

    const club = await clubRepository.get(id);

    if (club.getPresidentId() === context.tokenPayload.id) {
        throw new ApiError(
            400,
            ApiErrorStatus.BAD_REQUEST,
            "You cannot leave this club",
        );
    }

    const leaving = club
        .getMembers()
        .find((member) => member.id === context.tokenPayload.id);
    const newClub = new ClubValueObject({
        ...club.getObject(),
        members: club
            .getMembers()
            .filter((member) => member.id !== context.tokenPayload.id),
    });

    await clubRepository.put(newClub);

    const user = await usersRepository.get(context.tokenPayload.id);

    const newUser = new UserValueObject({
        ...user.getObject(),
        joinedClubs: user
            .getJoinedClubs()
            .filter((clubId) => clubId !== newClub.getId()),
    });

    await usersRepository.put(newUser);

    const president = await usersRepository.get(club.getPresidentId())
    await notifictionsService.send(
        NotificationValueObject.create(
            "left-club",
            {
                ":clubName": club.getDisplayName(),
                ":userName": leaving.displayName,
            },
            president,
            club.getId(),
        ),
    );
    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
