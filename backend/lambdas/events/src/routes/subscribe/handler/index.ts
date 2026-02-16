import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import EventValueObject from "@valueObjects/event.valueObject";
import eventsRepository from "@repositories/events.repository";
import clubRepository from "@repositories/club.repository";
import ApiError, { ApiErrorStatus } from "@services/errors.service";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    context: CustomContext,
) => {
    const clubEvent = await eventsRepository.get(
        event.pathParameters.clubId,
        event.pathParameters.id,
    );

    if (clubEvent.getVisibility() === "private") {
        const club = await clubRepository.get(event.pathParameters.clubId);

        const membership = club
            .getMembers()
            .find((member) => member.id === context.tokenPayload.id);

        if (!membership) {
            throw new ApiError(
                403,
                ApiErrorStatus.FORBIDDEN,
                "You are not allowed to subscribe to this private event",
            );
        }
    }

    const newClubEvent = new EventValueObject({
        ...clubEvent.getObject(),
        attendee: [
            ...clubEvent.getAttendee(),
            {
                id: context.tokenPayload.id,
                displayName: context.tokenPayload.displayName,
            },
        ],
    });

    await eventsRepository.put(newClubEvent);

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
