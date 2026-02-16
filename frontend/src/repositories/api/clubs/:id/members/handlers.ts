import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/members`);
    }
    async put(members: { id: string; role: string }[]): Promise<Result<void>> {
        const response = await this.callApiJson({
            method: "PUT",
            body: JSON.stringify({ members }),
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to update club");
        }
        return Result.ok<undefined>();
    }
}
