import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TResponse, TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import eventsRepository from "@repositories/events.repository";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import clubRepository from "@repositories/club.repository";
import { Roles } from "@valueObjects/club.valueObject";

const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    context: CustomContext,
) => {
    if (
        event.pathParameters?.visibility !== "public" &&
        event.pathParameters?.visibility !== "private"
    ) {
        throw new ApiError(
            400,
            ApiErrorStatus.BAD_REQUEST,
            "Invalid vidibility type",
        );
    }

    if (event.pathParameters.visibility === "private") {
        const club = await clubRepository.get(event.pathParameters.clubId)
    
        const membership = club.getMembers().find((member) => member.id === context.tokenPayload.id)
        if (!membership) {
            throw new ApiError(403, ApiErrorStatus.FORBIDDEN, "You are not allowed to see private events for this club")
        }
    }

    const events = await eventsRepository.listByClub(
        event.pathParameters.clubId,
        event.pathParameters.visibility,
    );

    return apiGatewayService.response<TResponse>(200, events.map((e) => e.getObject()));
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
