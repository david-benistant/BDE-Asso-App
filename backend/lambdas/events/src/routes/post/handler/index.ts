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

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<TBody, TPathParams>,
    context: CustomContext,
) => {
    const body = event.body;
    const newEventId: string = `${body.visibility}-${v4()}`

    const attachements = await Promise.all(body.attachedFiles.map(async (attachment) => {
        const presignedUrl = await s3Service.generatePutPreSignedUrl(propertiesService.getAttachmentsBucket(), `${newEventId}/${attachment}`)
        return {
            name: attachment,
            url: presignedUrl.signedUrl
        }
    }))

    const newEvent = new EventValueObject({
        clubId: event.pathParameters.clubId,
        id: newEventId,
        title: body.title,
        description: body.description,
        date: body.date,
        attachedObjects: body.attachedFiles.map((attachment) => `${newEventId}/${attachment}`),
        visibility: body.visibility as Tvisibility,
        attendee: [],
        duration: event.body.duration
    });

    await eventsRepository.put(newEvent)

    return apiGatewayService.response<TResponse>(201, {
        id: newEventId,
        presgignedUrls: attachements
    });
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
