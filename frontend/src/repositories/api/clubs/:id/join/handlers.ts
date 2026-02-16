import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/join`);
    }

    async put(message?: string): Promise<Result<void>> {
        const response = await this.callApiJson<undefined>({
            method: "PUT",
            body: JSON.stringify({ message })
        });

        if (response.isFailure) {
            return Result.fail<undefined>("Failed to join request this club");
        }

        return Result.ok<undefined>()

    }
}
