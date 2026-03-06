import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TResponse, TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import eventsRepository from "@repositories/events.repository";
import ApiError, { ApiErrorStatus } from "@services/errors.service";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    _context: CustomContext,
) => {
    if (
        Number.isNaN(Number.parseInt(event.pathParameters.week))
    ) {
        throw new ApiError(
            400,
            ApiErrorStatus.BAD_REQUEST,
            "Invalid vidibility type",
        );
    }

    const events = await eventsRepository.listByWeek(
        Number.parseInt(event.pathParameters.week)
    );

    const publicEvents = events.filter((event) => event.getVisibility() === "public")

    return apiGatewayService.response<TResponse>(200, publicEvents.map((e) => e.getObject()));
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
