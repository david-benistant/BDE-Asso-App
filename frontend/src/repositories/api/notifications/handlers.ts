import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";
import type { notificationValueObjectProps } from "@valueObjects/notifications/notifications.valueObject";
import NotificationValueObject from "@valueObjects/notifications/notifications.valueObject";

export default class extends ApiProvider {
    constructor() {
        super(`/notifications`);
    }

    async list(): Promise<Result<NotificationValueObject[]>> {
        const response = await this.callApiJson<notificationValueObjectProps[]>()

        if (response.isFailure) {
            return Result.fail<NotificationValueObject[]>("Failed to fetch latests notifications")
        }

        return Result.ok<NotificationValueObject[]>(response.getValue().map((value) => new NotificationValueObject(value)))
    }
}
