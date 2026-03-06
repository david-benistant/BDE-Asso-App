import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(id: string, memberId: string) {
        super(`/clubs/${id}/president/${memberId}`);
    }

    async put(): Promise<Result<void>> {
        const response = await this.callApiJson<undefined>({
            method: "PUT",
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to change the president");
        }

        return Result.ok<undefined>()
    }
}
