import propertiesService from "@services/properties.service";
import dynamoService from "@services/dynamo.service";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import JoinRequestValueObject, { joinRequestValueObjectProps } from "@valueObjects/join-request.valueObject";

class JoinRequestRepository {
    private name = propertiesService.getJoinRequestTable();

    public async put(item: JoinRequestValueObject): Promise<void> {
        try {
            await dynamoService.put<void>({
                TableName: this.name,
                Item: item,
            });
        } catch (e) {
            if (e instanceof ApiError) {
                throw e;
            } else {
                throw new ApiError(
                    500,
                    ApiErrorStatus.INTERNAL_SERVER_ERROR,
                    JSON.stringify(e),
                );
            }
        }
    }

    public async list(clubId: string): Promise<JoinRequestValueObject[]> {
        try {
            const result = await dynamoService.query<joinRequestValueObjectProps>({
                TableName: this.name,
                    KeyConditionExpression: "clubId = :cid",
                    ExpressionAttributeValues: {
                        ":cid": clubId,
                    },
            });

            return result.map((item) => new JoinRequestValueObject(item))
        } catch (e) {
            if (e instanceof ApiError) {
                throw e;
            } else {
                throw new ApiError(
                    500,
                    ApiErrorStatus.INTERNAL_SERVER_ERROR,
                    JSON.stringify(e),
                );
            }
        }
    }

    public async get(clubId: string, userId: string): Promise<JoinRequestValueObject> {
        try {
            const result = await dynamoService.get<joinRequestValueObjectProps>({
                TableName: this.name,
                Key: {
                    clubId,
                    userId
                }
            });

            return new JoinRequestValueObject(result)
        } catch (e) {
            if (e instanceof ApiError) {
                throw e;
            } else {
                throw new ApiError(
                    500,
                    ApiErrorStatus.INTERNAL_SERVER_ERROR,
                    JSON.stringify(e),
                );
            }
        }
    }

    public async delete(clubId: string, userId: string): Promise<void> {
        try {
            await dynamoService.delete({
                TableName: this.name,
                Key: {
                    clubId,
                    userId
                }
            });

        } catch (e) {
            if (e instanceof ApiError) {
                throw e;
            } else {
                throw new ApiError(
                    500,
                    ApiErrorStatus.INTERNAL_SERVER_ERROR,
                    JSON.stringify(e),
                );
            }
        }
    }
}

export default new JoinRequestRepository();


