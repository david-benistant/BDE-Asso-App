import { Handler } from "aws-lambda";
import middy from "@middy/core";
import { v4 } from "uuid";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import EventValueObject from "@valueObjects/event.valueObject";
import eventsRepository from "@repositories/events.repository";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    context: CustomContext,
) => {
    const clubEvent = await eventsRepository.get(
        event.pathParameters.clubId,
        event.pathParameters.id,
    );

    const newClubEvent = new EventValueObject({
        ...clubEvent.getObject(),
        attendee: clubEvent
            .getAttendee()
            .filter((attendee) => attendee.id !== context.tokenPayload.id),
    });

    await eventsRepository.put(newClubEvent);

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
