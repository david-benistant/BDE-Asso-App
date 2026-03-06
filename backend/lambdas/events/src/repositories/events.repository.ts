import propertiesService from "@services/properties.service";
import dynamoService from "@services/dynamo.service";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import EventValueObject, {
    eventValueObjectProps,
    Tvisibility,
} from "@valueObjects/event.valueObject";

class EventRepository {
    private name = propertiesService.getEventsTable();

    public async put(event: EventValueObject): Promise<void> {
        try {
            await dynamoService.put<void>({
                TableName: this.name,
                Item: event.getObject(),
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

    public async get(clubId: string, id: string): Promise<EventValueObject> {
        try {
            const result = await dynamoService.get<eventValueObjectProps>({
                TableName: this.name,
                Key: {
                    clubId,
                    id,
                },
            });

            return new EventValueObject(result);
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

    public async listByClub(
        clubId: string,
        visibility: Tvisibility,
    ): Promise<EventValueObject[]> {
        try {
            const result = await dynamoService.query<eventValueObjectProps>({
                TableName: this.name,
                KeyConditionExpression:
                    "clubId = :cid AND begins_with(id, :prefix)",
                ExpressionAttributeValues: {
                    ":cid": clubId,
                    ":prefix": `${visibility}-`,
                },
            });

            return result.map((item) => new EventValueObject(item));
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

    public async listByWeek(week: number): Promise<EventValueObject[]> {
        try {
            const result = await dynamoService.query<eventValueObjectProps>({
                TableName: this.name,
                IndexName: "weeksIndex",
                KeyConditionExpression: "weekBucket = :week",
                ExpressionAttributeValues: {
                ":week": week
                }
            });

            return result.map((item) => new EventValueObject(item));
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

export default new EventRepository();
