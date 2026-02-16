import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/unfollow`);
    }

    async put(): Promise<Result<void>> {
        const response = await this.callApiJson<undefined>({
            method: "PUT",
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to unfollow this club");
        }

        return Result.ok<undefined>()

    }
}
