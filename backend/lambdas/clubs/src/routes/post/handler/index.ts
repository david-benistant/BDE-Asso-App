import { Handler } from "aws-lambda";
import middy from "@middy/core";
import ClubValueObject from "@valueObjects/club.valueObject";
import { v4 } from "uuid";
import clubRepository from "@repositories/club.repository";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TBody, TResponse, bodySchema } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import schemaValidatorMiddleware from "@middlewares/schema-validator";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<TBody>,
    context: CustomContext,
) => {
    const body = event.body;

    const object = new ClubValueObject({
        id: v4(),
        name: body.name.toLowerCase(),
        displayName: body.name,
        description: "",
        presidentId: context.tokenPayload!.id,
        thumbnail: "",
        pictures: [],
        members: [],
        nbFollowers: 0,
    });

    await clubRepository.put(object);

    return apiGatewayService.response<TResponse>(201, object.getObject());
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
