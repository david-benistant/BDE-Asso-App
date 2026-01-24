import { Handler } from "aws-lambda";
import usersRepository from "../../../repositories/users.repository";
import middy from "@middy/core";
import authMiddleware from "../../../middlewares/auth";
import errorHandlerMiddleware from "../../../middlewares/errorHandler";
import { TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "../../../entities/apiGateway";
import apiGatewayService from "../../../services/api-gateway.service";

export const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
) => {
    const { id } = event.pathParameters;

    const user = await usersRepository.get(id);

    return apiGatewayService.response(200, user.getObject());
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
