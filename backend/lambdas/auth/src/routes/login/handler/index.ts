import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import graphService from "@services/graph.service";
import propertiesService from "@services/properties.service";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import TokensService from "@services/tokens.service";
import UserRepository from "@repositories/users.repository";
import UserValueObject from "@valueObjects/users.valueObject";
import s3Service from "@services/s3.service";
import { type TResponse } from "../schema";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import middy from "@middy/core";
import apiGatewayService from "@services/api-gateway.service";

export const baseHandler: Handler = async (event: APIGatewayProxyEventV2) => {
    const AzureAccessToken = event.headers?.authorization
        ?.replace("Bearer ", "")
        .replace("Token ", "");

    if (!AzureAccessToken) {
        throw new ApiError(401, ApiErrorStatus.UNAUTHORIZED, "No access token");
    }

    const me = await graphService.getMe(AzureAccessToken);

    const decodeAzureToken = TokensService.decodeAzureToken(AzureAccessToken);

    if (decodeAzureToken.appid !== propertiesService.getAzureClientId()) {
        throw new ApiError(
            401,
            ApiErrorStatus.UNAUTHORIZED,
            "Invalid Azure access token",
        );
    }

    let user = await UserRepository.getNotThrow(decodeAzureToken.oid);

    if (!user) {
        user = new UserValueObject({
            id: me.id,
            email: me.mail,
            displayName: me.displayName,
            name: me.displayName.toLowerCase(),
            followedClubs: [],
            joinedClubs: []
        });
        await UserRepository.put(user);
        const photo = await graphService.getMePhoto(AzureAccessToken);
        await s3Service.putObject(
            propertiesService.getProfileBucket(),
            me.id,
            photo,
        );
    }

    const accessToken = TokensService.generateAccessToken(user);

    return apiGatewayService.response<TResponse>(200, { accessToken });
};

export const handler = middy(baseHandler).use(errorHandlerMiddleware());
