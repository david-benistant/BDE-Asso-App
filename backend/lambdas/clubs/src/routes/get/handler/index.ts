import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware from "@middlewares/auth";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import { TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import clubRepository from "@repositories/club.repository";

export const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
) => {
    const { id } = event.pathParameters;

    const club = await clubRepository.get(id);

    return apiGatewayService.response(200, club.getObject());
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
