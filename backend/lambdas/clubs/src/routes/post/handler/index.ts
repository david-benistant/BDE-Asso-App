import { Handler } from "aws-lambda";
import middy from "@middy/core";
import ClubValueObject, { Roles } from "@valueObjects/club.valueObject";
import { v4 } from "uuid";
import clubRepository from "@repositories/club.repository";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TBody, TResponse, bodySchema } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import schemaValidatorMiddleware from "@middlewares/schema-validator";
import usersRepository from "@repositories/users.repository";
import UserValueObject from "@valueObjects/users.valueObject";

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
        members: [ {id: context.tokenPayload!.id, role: Roles.PRESIDENT, displayName: context.tokenPayload.displayName }],
        followers: [],
    });

    await clubRepository.put(object);

    const user = await usersRepository.get(context.tokenPayload!.id)

    const newUser = new UserValueObject({ ...user.getObject(), joinedClubs: [ ...user.getJoinedClubs(), object.getId()] })

    await usersRepository.put(newUser)

    return apiGatewayService.response<TResponse>(201, object.getObject());
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
