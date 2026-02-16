import ApiProvider from "@repositories/api/ApiProvider";
import { Result } from "@utils/Result";
import type { joinRequestValueObjectProps } from "@valueObjects/clubs/pendings/join-request.valueObject";
import JoinRequestValueObject from "@valueObjects/clubs/pendings/join-request.valueObject";

export default class extends ApiProvider {
    constructor(id: string) {
        super(`/clubs/${id}/join/pendings`);
    }

    async get(): Promise<Result<JoinRequestValueObject[]>> {
        const response =
            await this.callApiJson<joinRequestValueObjectProps[]>();

        if (response.isFailure) {
            return Result.fail<JoinRequestValueObject[]>(
                "Failed to get pendings request",
            );
        }

        return Result.ok<JoinRequestValueObject[]>(
            response.getValue().map((item) => new JoinRequestValueObject(item)),
        );
    }
}
