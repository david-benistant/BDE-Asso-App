import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/join/refuse`);
    }

    async put(userId: string): Promise<Result<void>> {
        const response = await this.callApiJson<undefined>({
            method: "PUT",
            body: JSON.stringify({ userId })
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to refuse this join request");
        }

        return Result.ok<undefined>()

    }
}
