import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/pictures/delete`);
    }

    async put(hashs: string[]): Promise<Result<undefined>> {
        const response = await this.callApiJson({
            method: "PUT",
            body: JSON.stringify({ hashs })
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to delete pictures")
        }

        return Result.ok<undefined>()
    }
}
