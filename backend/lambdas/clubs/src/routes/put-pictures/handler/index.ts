import { Handler } from "aws-lambda";
import middy from "@middy/core";
import ClubValueObject from "@valueObjects/club.valueObject";
import clubRepository from "@repositories/club.repository";
import authMiddleware, { CustomContext } from "@middlewares/auth";
import { TBody, TPathParams, bodySchema } from "../schema";
import { TypedAPIGatewayEvent } from "@entities/apiGateway";
import apiGatewayService from "@services/api-gateway.service";
import errorHandlerMiddleware from "@middlewares/errorHandler";
import schemaValidatorMiddleware from "@middlewares/schema-validator";
import s3Service from "@services/s3.service";
import propertiesService from "@services/properties.service";
import ApiError, { ApiErrorStatus } from "@services/errors.service";

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
        pictures: [...club.getPictures(), ...event.body.hashs],
    });

    const presignedUrls = await Promise.all(
        event.body.hashs.map(async (hash) => {
            const url = await s3Service.generatePutPreSignedUrl(
                propertiesService.getPicturesBucket(),
                hash,
            );

            return { hash, url: url.signedUrl }
        }),
    );

    await clubRepository.put(newClub);

    return apiGatewayService.response(200, {
        presignedUrls,
    });
};

export const handler = middy(baseHandler)
    .use(authMiddleware())
    .use(schemaValidatorMiddleware(bodySchema))
    .use(errorHandlerMiddleware());
