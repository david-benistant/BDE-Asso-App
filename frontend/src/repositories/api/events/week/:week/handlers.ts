import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";
import type { eventValueObjectProps } from "@valueObjects/events/event.valueObject";
import EventValueObject from "@valueObjects/events/event.valueObject";

export default class extends ApiProvider {
    constructor(week: number) {
        super(`/events/week/${week}`);
    }

    async list(): Promise<Result<EventValueObject[]>> {
        const response = await this.callApiJson<eventValueObjectProps[]>({
            method: "GET",
        });

        if (response.isFailure) {
            return Result.fail<EventValueObject[]>("Failed to list events");
        }

        return Result.ok<EventValueObject[]>(response.getValue().map((event) => new EventValueObject(event)));
    }
}
