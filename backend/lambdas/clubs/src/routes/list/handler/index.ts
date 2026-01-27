import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware from "@middlewares/auth";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import clubRepository from "@repositories/club.repository";

export const baseHandler: Handler = async (
) => {
    const clubs = await clubRepository.list()

    return apiGatewayService.response(200, clubs.map((club) => club.getObject()));
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
