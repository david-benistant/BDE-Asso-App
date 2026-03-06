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
import notifictionsService from "@services/notifications.service";
import NotificationValueObject from "@valueObjects/notifications.valueObject";
import usersRepository from "@repositories/users.repository";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    context: CustomContext,
) => {
    const { id, memberId } = event.pathParameters;

    const club = await clubRepository.get(id);

    
    if (club.getPresidentId() !== context.tokenPayload?.id) {
        throw new ApiError(
            403,
            ApiErrorStatus.FORBIDDEN,
            "You are not allowed to perform this action",
        );
    }

    
    if (!club.getMembers().find((member) => member.id === memberId)) {
        throw new ApiError(
            400,
            ApiErrorStatus.BAD_REQUEST,
            "The spicified user is not in the club",
        );
    }
    
    const new_president = await usersRepository.get(memberId)

    const newClub = new ClubValueObject({
        ...club.getObject(),
        members: club.getMembers().map((member) => {
            if (member.id === context.tokenPayload.id) {
                return {
                    ...member,
                    role: Roles.ORGANISATOR
                }
            }
            if (member.id === memberId) {
                return {
                    ...member,
                    role: Roles.PRESIDENT
                }
            }
            return member
        }),
        presidentId: memberId
    });

    await clubRepository.put(newClub)

    await notifictionsService.send(NotificationValueObject.create("new-president", { ":clubName": club.getDisplayName() }, new_president, club.getId()))

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
