import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(id: string, userId: string) {
        super(`/clubs/${id}/members/${userId}`);
    }
    async delete(): Promise<Result<void>> {
        const response = await this.callApiJson({
            method: "DELETE",
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to delete member");
        }
        return Result.ok<undefined>()
    }
}
