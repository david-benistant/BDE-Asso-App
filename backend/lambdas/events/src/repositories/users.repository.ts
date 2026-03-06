import propertiesService from "@services/properties.service";
import dynamoService from "@services/dynamo.service";
import UserValueObject, {
    userValueObjectProps,
} from "@valueObjects/users.valueObject";
import ApiError, { ApiErrorStatus } from "@services/errors.service";

class UserRepository {
    private name = propertiesService.getUserTable();

    public async get(id: string): Promise<UserValueObject> {
        try {
            const result = await dynamoService.get<userValueObjectProps>({
                TableName: this.name,
                Key: {
                    id,
                },
            });

            return new UserValueObject(result);
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

    public async batchGetNotThrow(ids: string[]): Promise<UserValueObject[]> {
        const items = await dynamoService.noLimitBatchGet<userValueObjectProps>(
            this.name,
            ids.map((id) => ({ id })),
        );

        return items.map((item) => new UserValueObject(item));
    }

    public async getNotThrow(id: string): Promise<UserValueObject | undefined> {
        try {
            const result = await dynamoService.get<userValueObjectProps>({
                TableName: this.name,
                Key: {
                    id,
                },
            });

            return new UserValueObject(result);
        } catch (e) {
            return undefined;
        }
    }

    public async put(user: UserValueObject) {
        await dynamoService.put({
            TableName: this.name,
            Item: user.getObject(),
        });
    }
}

export default new UserRepository();
