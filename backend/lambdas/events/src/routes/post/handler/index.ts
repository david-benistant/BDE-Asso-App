import { Handler } from "aws-lambda";
import middy from "@middy/core";
import { v4 } from "uuid";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TBody, TResponse, bodySchema, TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import schemaValidatorMiddleware from "@middlewares/schema-validator";
import EventValueObject, { Tvisibility } from "@valueObjects/event.valueObject";
import s3Service from "@services/s3.service";
import propertiesService from "@services/properties.service";
import dynamoService from "@services/dynamo.service";
import eventsRepository from "@repositories/events.repository";
import clubRepository from "@repositories/club.repository";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import { Roles } from "@valueObjects/club.valueObject";
import usersRepository from "@repositories/users.repository";
import notifictionsService from "@services/notifications.service";
import NotificationValueObject from "@valueObjects/notifications.valueObject";

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
    const newEventId: string = `${body.visibility}-${v4()}`;

    const club = await clubRepository.get(event.pathParameters.clubId);

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
            ApiErrorStatus.FORBIDDEN,
            "You are not allowed to create an event",
        );
    }

    const attachements = await Promise.all(
        body.attachedFiles.map(async (attachment) => {
            const presignedUrl = await s3Service.generatePutPreSignedUrl(
                propertiesService.getAttachmentsBucket(),
                `${newEventId}/${attachment}`,
            );
            return {
                name: attachment,
                url: presignedUrl.signedUrl,
            };
        }),
    );

    const newEvent = new EventValueObject({
        clubId: event.pathParameters.clubId,
        id: newEventId,
        title: body.title,
        description: body.description,
        date: body.date,
        attachedObjects: body.attachedFiles.map(
            (attachment) => `${newEventId}/${attachment}`,
        ),
        visibility: body.visibility as Tvisibility,
        attendee: [],
        duration: event.body.duration,
        weekBucket: getWeekNumber(body.date),
    });

    await eventsRepository.put(newEvent);

    const members = await usersRepository.batchGetNotThrow(
        club.getMembers().map((member) => member.id),
    );
    const followers = await usersRepository.batchGetNotThrow(
        club.getfollowers(),
    );

    await notifictionsService.batchSend(
        NotificationValueObject.create(
            "new-event",
            {
                ":clubName": club.getDisplayName(),
                ":eventName": newEvent.getTitle(),
            },
            { getDisplayName: () => "", getEmail: () => "", getId: () => "" },
            `${newEvent.getClubId()}/event/${newEvent.getId()}`,
        ),
        Array.from(
            new Map(
                [...members, ...followers].map((user) => [user.getId(), user]),
            ).values(),
        ),
    );

    return apiGatewayService.response<TResponse>(201, {
        id: newEventId,
        presgignedUrls: attachements,
    });
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
