import { Handler } from "aws-lambda";
import middy from "@middy/core";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import { TPathParams } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import clubRepository from "@repositories/club.repository";
import ClubValueObject from "@valueObjects/club.valueObject";
import usersRepository from "@repositories/users.repository";
import UserValueObject from "@valueObjects/users.valueObject";

export const baseHandler: Handler = async (
    event: TypedAPIGatewayEvent<{}, TPathParams>,
    context: CustomContext,
) => {
    const { id } = event.pathParameters;

    const club = await clubRepository.get(id);

    const newClub = new ClubValueObject({
        ...club.getObject(),
        followers: [...club.getfollowers(), context.tokenPayload.id],
    });

    const user = await usersRepository.get(context.tokenPayload.id);
    const newUser = new UserValueObject({
        ...user.getObject(),
        followedClubs: [...user.getFollowedClubs(), club.getId()],
    });

    await clubRepository.put(newClub);
    await usersRepository.put(newUser);

    return apiGatewayService.response(204);
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(errorHandlerMiddleware());
