import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/join/pending`);
    }

    async get(): Promise<Result<boolean>> {
        const response = await this.callApiJson<{ pending: boolean }>();

        if (response.isFailure) {
            return Result.fail<boolean>("Failed to get pending request");
        }

        return Result.ok<boolean>(response.getValue().pending)

    }
}
