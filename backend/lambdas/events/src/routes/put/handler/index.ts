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

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<TBody, TPathParams>,
    context: CustomContext,
) => {
    const body = event.body;

    const { clubId, eventId} = event.pathParameters

    const clubEvent = await eventsRepository.get(clubId, eventId);

    const newEvent = new EventValueObject({ ...clubEvent.getObject(), ...body })


    await eventsRepository.put(newEvent)

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
