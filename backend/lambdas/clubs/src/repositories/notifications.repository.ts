import dynamoService from "@services/dynamo.service";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import propertiesService from "@services/properties.service";
import NotificationValueObject, {
    notificationValueObjectProps,
} from "@valueObjects/notifications.valueObject";

class NotificationsRepository {
    private name = propertiesService.getNotificationTable();

    public async put(
        notification: NotificationValueObject,
    ): Promise<undefined> {
        try {
            await dynamoService.put<notificationValueObjectProps>({
                TableName: this.name,
                Item: notification.getObject()
            }
            );
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

    public async batchPut(
        notifications: NotificationValueObject[],
    ): Promise<undefined> {
        try {
            await dynamoService.batchPut<notificationValueObjectProps>(
                this.name,
                notifications.map((item) => item.getObject()),
            );
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

    public async query(userId: string): Promise<NotificationValueObject[]> {
        try {
            const result =
                await dynamoService.query<notificationValueObjectProps>({
                    TableName: this.name,
                    KeyConditionExpression: "userId = :uid",
                    ExpressionAttributeValues: {
                        ":uid": userId,
                    },
                });
            return result.map((item) => new NotificationValueObject(item));
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

export default new NotificationsRepository();
