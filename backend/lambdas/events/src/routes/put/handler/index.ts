import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TBody, bodySchema, TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import schemaValidatorMiddleware from "@middlewares/schema-validator";
import EventValueObject, { Tvisibility } from "@valueObjects/event.valueObject";
import eventsRepository from "@repositories/events.repository";
import clubRepository from "@repositories/club.repository";
import { Roles } from "@valueObjects/club.valueObject";
import ApiError, { ApiErrorStatus } from "@services/errors.service";

const getWeekNumber = (date: number): number => {
    const dateObj = new Date(date * 1000);
    const d = new Date(
        Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
        ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    return weekNo;
};

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<TBody, TPathParams>,
    context: CustomContext,
) => {
    const body = event.body;

    const { clubId, eventId } = event.pathParameters;

    const club = await clubRepository.get(clubId);

    const membership = club
        .getMembers()
        .find((member) => member.id === context.tokenPayload.id);

    if (!membership) {
        throw new ApiError(
            403,
            ApiErrorStatus.FORBIDDEN,
            "You are not in this club",
        );
    }

    if (
        membership.role !== Roles.PRESIDENT &&
        membership.role !== Roles.ORGANISATOR
    ) {
        throw new ApiError(
            403,
            ApiErrorStatus?.FORBIDDEN,
            "You are not allowed to edit this event",
        );
    }

    const clubEvent = await eventsRepository.get(clubId, eventId);

    const newEvent = new EventValueObject({
        ...clubEvent.getObject(),
        ...body,
        weekBucket: getWeekNumber(body.date),
    });

    await eventsRepository.put(newEvent);

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
