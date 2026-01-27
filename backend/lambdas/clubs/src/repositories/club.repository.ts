import propertiesService from "@services/properties.service";
import dynamoService from "@services/dynamo.service";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import ClubValueObject, {
    clubValueObjectProps,
} from "@valueObjects/club.valueObject";

class ClubRepository {
    private name = propertiesService.getClubsTable();

    async put(club: ClubValueObject) {
        await dynamoService.put({
            TableName: this.name,
            Item: club.getObject(),
        });
    }

    async get(id: string): Promise<ClubValueObject> {
        try {
            const object = await dynamoService.get<clubValueObjectProps>({
                TableName: this.name,
                Key: {
                    id,
                },
            });

            return new ClubValueObject(object);
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

    async list(): Promise<ClubValueObject[]> {
        try {
            const object = await dynamoService.scan<clubValueObjectProps>({
                TableName: this.name
            })

            return object.map((obj) => new ClubValueObject(obj))
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

export default new ClubRepository();
