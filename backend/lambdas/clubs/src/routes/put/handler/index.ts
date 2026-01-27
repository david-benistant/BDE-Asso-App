import { Handler } from "aws-lambda";
import middy from "@middy/core";
import ClubValueObject from "@valueObjects/club.valueObject";
import clubRepository from "@repositories/club.repository";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TBody, TPathParams, bodySchema } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import schemaValidatorMiddleware from "@middlewares/schema-validator";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<TBody, TPathParams>,
    context: CustomContext,
) => {
    const { id } = event.pathParameters;

    const club = await clubRepository.get(id);

    if (club.getPresidentId() !== context.tokenPayload?.id) {
        throw new ApiError(
            403,
            ApiErrorStatus.FORBIDDEN,
            "You are not allowed to perform this action",
        );
    }

    const newClub = new ClubValueObject({
        ...club.getObject(),
        name: event.body.displayName.toLowerCase(),
        displayName: event.body.displayName,
        description: event.body.description,
    });

    await clubRepository.put(newClub)

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
