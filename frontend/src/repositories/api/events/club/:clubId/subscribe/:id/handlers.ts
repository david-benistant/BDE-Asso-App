import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(clubId: string, id: string) {
        super(`/events/club/${clubId}/subscribe/${id}`);
    }

    async put(): Promise<Result<void>> {
        const response = await this.callApiJson<void>({
            method: "PUT",
        });

        if (response.isFailure) {
            return Result.fail<void>("Failed to list events");
        }

        return Result.ok<void>();
    }
}
