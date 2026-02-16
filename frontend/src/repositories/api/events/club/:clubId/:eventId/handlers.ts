import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(clubId: string, eventId: string) {
        super(`/events/club/${clubId}/${eventId}`);
    }

    async put(props: {
        title: string;
        description: string;
        date: Date;
        duration: number;
    }): Promise<Result<void>> {
        const response = await this.callApiJson({
            method: "POST",
            body: JSON.stringify({
                ...props,
                date: props.date.getTime() / 1000,
            }),
        });

        if (response.isFailure) {
            return Result.fail<void>("Failed to update event");
        }

        return Result.ok<void>();
    }
}
